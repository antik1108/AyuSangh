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

@Injectable()
export class SearchService {
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
