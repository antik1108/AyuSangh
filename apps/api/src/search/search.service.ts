import { Injectable } from '@nestjs/common';
import { HospitalService } from '../hospital/hospital.service';
import { DoctorService } from '../doctor/doctor.service';
import { DatabaseService } from '../database/database.service';

type SearchResult = {
  hospitals: unknown[];
  doctors: unknown[];
};

type CacheEntry = {
  expiresAt: number;
  data: SearchResult;
};

/**
 * SearchService
 *
 * Implements global search with a TTL-based cache layer.
 *
 * CACHE IMPLEMENTATION NOTE (MVP):
 * The sequence diagram (Search_Institutions.d2) models a dedicated Cache actor,
 * which in production maps to Redis via NestJS CacheModule.
 * For MVP, this uses an in-process Map<string, CacheEntry> with a 5-minute TTL,
 * which is functionally equivalent for single-instance deployments.
 *
 * Migration path to Redis (post-MVP):
 *   1. Install: pnpm add @nestjs/cache-manager cache-manager ioredis
 *   2. Register CacheModule.register({ store: redisStore, ... }) in SearchModule
 *   3. Inject CACHE_MANAGER and replace this.searchCache with cache.get/set calls
 *   4. TTL and key strategy remain identical
 */
@Injectable()
export class SearchService {
  /** TTL matches the sequence diagram: "set cache key TTL 5min" */
  private readonly cacheTtlMs = 5 * 60 * 1000;
  private readonly searchCache = new Map<string, CacheEntry>();

  constructor(
    private readonly hospitalService: HospitalService,
    private readonly doctorService: DoctorService,
    private readonly prisma: DatabaseService,
  ) {}

  async globalSearch(query: string) {
    const normalizedQuery = query.trim().toLowerCase();
    const cached = this.searchCache.get(normalizedQuery);

    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const [hospitals, doctors] = await Promise.all([
      this.hospitalService.search(query, undefined),
      this.doctorService.search(query),
    ]);

    const result = { hospitals, doctors };
    this.searchCache.set(normalizedQuery, {
      expiresAt: Date.now() + this.cacheTtlMs,
      data: result,
    });

    return result;
  }

  async cleanupTestData() {
    // Delete test users (records with 'check' in email) and related data
    const deletedCount = await this.prisma.user.deleteMany({
      where: { email: { contains: 'check', mode: 'insensitive' } },
    });

    // Invalidate cache so subsequent searches return fresh data.
    this.searchCache.clear();

    return { message: `Deleted ${deletedCount.count} test record(s)` };
  }
}
