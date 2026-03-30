import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import type {
  Prisma,
  Hospital,
  Doctor,
  Review,
  Location,
  InstitutionType,
} from '@prisma/client';

/**
 * Complete hospital with relations for search results
 */
export interface HospitalSearchResult extends Hospital {
  location: Location;
  reviews: Review[];
}

/**
 * Complete doctor with relations for search results
 */
export interface DoctorSearchResult extends Doctor {
  reviews: Review[];
  institutions: Array<{
    id: string;
    doctorId: string;
    hospitalId: string;
    joinedAt: Date;
    hospital: Hospital & { location: Location };
  }>;
}

/**
 * Combined search results
 */
export interface SearchResult {
  hospital?: HospitalSearchResult[];
  doctor?: DoctorSearchResult[];
}

/**
 * Configuration for general search
 */
interface SearchOptions {
  query: string;
  type?: 'hospital' | 'doctor' | 'all';
  limit?: number;
  offset?: number;
}

/**
 * Validation helper for InstitutionType enum
 */
function isValidInstitutionType(
  value: string | undefined,
): value is InstitutionType {
  if (!value) return false;
  const validTypes: InstitutionType[] = [
    'HOSPITAL',
    'CLINIC',
    'DIAGNOSTIC_CENTRE',
    'NURSING_HOME',
  ];
  return validTypes.includes(value as InstitutionType);
}

@Injectable()
export class AdvancedSearchService {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Perform full-text search across hospitals and doctors
   * Supports keyword matching, relevance ranking, and filtering
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    const { query, type = 'all', limit = 20, offset = 0 } = options;

    const searchTerm = this._escapeSearchTerm(query);
    const result: SearchResult = {};

    if (type === 'hospital' || type === 'all') {
      result.hospital = await this._searchHospitals(searchTerm, limit, offset);
    }

    if (type === 'doctor' || type === 'all') {
      result.doctor = await this._searchDoctors(searchTerm, limit, offset);
    }

    return result;
  }

  /**
   * Search hospitals with advanced filtering
   */
  async advancedHospitalSearch(options: {
    query?: string;
    institutionType?: string;
    city?: string;
    state?: string;
    minRating?: number;
    maxRating?: number;
    limit?: number;
    offset?: number;
  }): Promise<HospitalSearchResult[]> {
    const {
      query,
      institutionType,
      city,
      state,
      minRating,
      maxRating,
      limit = 20,
      offset = 0,
    } = options;

    // Build dynamic where clause with proper typing
    const where: Prisma.HospitalWhereInput = {};

    // Validate and set institution type if provided
    if (institutionType && isValidInstitutionType(institutionType)) {
      where.institutionType = institutionType;
    }

    // Add location filters
    if (city || state) {
      where.location = {};
      if (city) {
        (where.location as Prisma.LocationWhereInput).city = {
          contains: city,
          mode: 'insensitive',
        };
      }
      if (state) {
        (where.location as Prisma.LocationWhereInput).state = {
          contains: state,
          mode: 'insensitive',
        };
      }
    }

    // Add rating filters
    if (minRating !== undefined || maxRating !== undefined) {
      const ratingFilter: Prisma.FloatFilter = {};
      if (minRating !== undefined) {
        ratingFilter.gte = minRating;
      }
      if (maxRating !== undefined) {
        ratingFilter.lte = maxRating;
      }
      where.rating = ratingFilter;
    }

    // Add text search
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const hospitals = await this.databaseService.hospital.findMany({
      where,
      include: {
        location: true,
        reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return hospitals as HospitalSearchResult[];
  }

  /**
   * Search doctors with advanced filtering
   */
  async advancedDoctorSearch(options: {
    query?: string;
    specialization?: string;
    city?: string;
    minRating?: number;
    maxRating?: number;
    institutionId?: string;
    limit?: number;
    offset?: number;
  }): Promise<DoctorSearchResult[]> {
    const {
      query,
      specialization,
      city,
      minRating,
      maxRating,
      institutionId,
      limit = 20,
      offset = 0,
    } = options;

    const where: Prisma.DoctorWhereInput = {};

    if (specialization) {
      where.specialization = {
        contains: specialization,
        mode: 'insensitive',
      };
    }

    if (institutionId) {
      where.institutions = {
        some: { hospitalId: institutionId },
      };
    }

    if (query) {
      where.OR = [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { specialization: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
      ];
    }

    const doctors = await this.databaseService.doctor.findMany({
      where,
      include: {
        reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
        institutions: {
          include: { hospital: { include: { location: true } } },
        },
      },
      take: limit,
      skip: offset,
    });

    // Filter by city and rating if specified
    if (!city && minRating === undefined && maxRating === undefined) {
      return doctors as DoctorSearchResult[];
    }

    return doctors.filter((doctor) => {
      // Check city filter
      if (city) {
        const hasCity = (doctor as DoctorSearchResult).institutions.some((di) => {
          const doctorCity = di.hospital.location?.city ?? '';
          return doctorCity.toLowerCase().includes(city.toLowerCase());
        });
        if (!hasCity) return false;
      }

      // Check rating filters
      const d = doctor as DoctorSearchResult;
      if (d.reviews && d.reviews.length > 0) {
        const avgRating =
          d.reviews.reduce((sum: number, r) => sum + (r.ratingOverall ?? 0), 0) /
          d.reviews.length;
        if (minRating !== undefined && avgRating < minRating) return false;
        if (maxRating !== undefined && avgRating > maxRating) return false;
      }

      return true;
    }) as DoctorSearchResult[];
  }

  /**
   * Get trending searches based on search frequency
   */
  async getTrendingSearches(limit: number = 10): Promise<string[]> {
    // This would require a SearchKey table to track searches
    // For now, return top institutions
    const hospitals = await this.databaseService.hospital.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { name: true },
    });

    return hospitals.map((h) => h.name);
  }

  /**
   * Geocoded search - find institutions within radius
   */
  async findNearby(options: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    limit?: number;
  }): Promise<Array<Hospital & { location: Location; distance_km?: number }>> {
    const { latitude, longitude, radiusKm = 5, limit = 20 } = options;

    // Using Haversine formula approximation for PostgreSQL
    // Distance formula: sqrt((lat2-lat1)² + (lng2-lng1)²) * 111 (approx km conversion)
    const hospitals = await this.databaseService.$queryRaw<
      Array<Hospital & { location: Location; distance_km: number }>
    >`
      SELECT 
        h.id,
        h.name,
        h."institutionType",
        h.rating,
        h."adminId",
        h."locationId",
        h.phone,
        h.website,
        h.email,
        h."profilePhoto",
        h."isActive",
        h."createdAt",
        h."updatedAt",
        l.id as location_id,
        l.address,
        l.city,
        l.state,
        l."zipCode",
        l.country,
        l.latitude,
        l.longitude,
        SQRT(
          POWER(CAST(l.latitude AS float) - ${latitude}, 2) + 
          POWER(CAST(l.longitude AS float) - ${longitude}, 2)
        ) * 111 AS distance_km
      FROM "Hospital" h
      JOIN "Location" l ON h."locationId" = l.id
      WHERE SQRT(
        POWER(CAST(l.latitude AS float) - ${latitude}, 2) + 
        POWER(CAST(l.longitude AS float) - ${longitude}, 2)
      ) * 111 <= ${radiusKm}
      ORDER BY distance_km ASC
      LIMIT ${limit}
    `;

    return hospitals;
  }

  /**
   * Search hospitals by multiple criteria
   */
  async getHospitalsByFilters(filters: {
    institutionType?: string;
    minBeds?: number;
    maxBeds?: number;
    hasOPD?: boolean;
    city?: string;
    state?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
  }): Promise<HospitalSearchResult[]> {
    const {
      institutionType,
      city,
      state,
      minRating,
      limit = 20,
      offset = 0,
    } = filters;

    const where: Prisma.HospitalWhereInput = {};

    // Validate institution type if provided
    if (institutionType && isValidInstitutionType(institutionType)) {
      where.institutionType = institutionType;
    }

    // Add location filters
    if (city || state) {
      where.location = {};
      if (city) {
        (where.location as Prisma.LocationWhereInput).city = {
          contains: city,
          mode: 'insensitive',
        };
      }
      if (state) {
        (where.location as Prisma.LocationWhereInput).state = {
          contains: state,
          mode: 'insensitive',
        };
      }
    }

    // Add minimum rating filter
    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    const hospitals = await this.databaseService.hospital.findMany({
      where,
      include: {
        location: true,
        reviews: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return hospitals as HospitalSearchResult[];
  }

  /**
   * Private helper methods
   */

  /**
   * Search hospitals with FTS
   */
  private async _searchHospitals(
    searchTerm: string,
    limit: number,
    offset: number,
  ): Promise<HospitalSearchResult[]> {
    const hospitals = await this.databaseService.hospital.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        location: true,
        reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return hospitals as HospitalSearchResult[];
  }

  /**
   * Search doctors with FTS
   */
  private async _searchDoctors(
    searchTerm: string,
    limit: number,
    offset: number,
  ): Promise<DoctorSearchResult[]> {
    const doctors = await this.databaseService.doctor.findMany({
      where: {
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { specialization: { contains: searchTerm, mode: 'insensitive' } },
          { bio: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
        institutions: {
          include: { hospital: { include: { location: true } } },
        },
      },
      take: limit,
      skip: offset,
    });

    return doctors as DoctorSearchResult[];
  }

  /**
   * Escape special characters for PostgreSQL FTS
   */
  private _escapeSearchTerm(term: string): string {
    return term.replace(/[&|!()'"<>*]/g, '\\$&').trim();
  }
}
