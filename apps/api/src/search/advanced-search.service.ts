import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface SearchResult {
  hospital?: any[];
  doctor?: any[];
}

interface SearchOptions {
  query: string;
  type?: 'hospital' | 'doctor' | 'all';
  limit?: number;
  offset?: number;
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
   * Search hospitals with FTS and filtering
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
  }) {
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

    // Build dynamic where clause
    const where: Record<string, any> = {};

    if (institutionType) {
      where.institutionType = institutionType;
    }

    if (city) {
      where.location = { city: { contains: city, mode: 'insensitive' } };
    }

    if (state) {
      if (where.location) {
        (where.location as Record<string, any>).state = {
          contains: state,
          mode: 'insensitive',
        };
      } else {
        where.location = { state: { contains: state, mode: 'insensitive' } };
      }
    }

    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      if (minRating !== undefined) {
        (where.rating as Record<string, any>).gte = minRating;
      }
      if (maxRating !== undefined) {
        (where.rating as Record<string, any>).lte = maxRating;
      }
    }

    // Basic text search if query provided
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    return this.databaseService.hospital.findMany({
      where: where as any,
      include: {
        location: true,
        reviews: { select: { rating: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Search doctors with enhanced filtering
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
  }) {
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

    const where: Record<string, any> = {};

    if (specialization) {
      where.specialization = {
        contains: specialization,
        mode: 'insensitive',
      };
    }

    if (institutionId) {
      (where as Record<string, any>).institutions = {
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
      where: where as any,
      include: {
        reviews: { select: { rating: true } },
        institutions: {
          include: { hospital: { include: { location: true } } },
        },
      },
      take: limit,
      skip: offset,
    });

    // Filter by city and rating if specified
    if (!city && minRating === undefined && maxRating === undefined) {
      return doctors;
    }

    return doctors.filter((doctor: any) => {
      // Check city filter
      if (city) {
        const hasCity = (doctor as any).institutions.some((di: any) =>
          di.hospital.location.city.toLowerCase().includes(city.toLowerCase()),
        );
        if (!hasCity) return false;
      }

      // Check rating filters
      if (doctor.reviews.length > 0) {
        const avgRating =
          (doctor.reviews as any[]).reduce((sum, r: any) => sum + r.rating, 0) /
          doctor.reviews.length;
        if (minRating !== undefined && avgRating < minRating) return false;
        if (maxRating !== undefined && avgRating > maxRating) return false;
      }

      return true;
    });
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
  }) {
    const { latitude, longitude, radiusKm = 5, limit = 20 } = options;

    // Using Haversine formula approximation for PostgreSQL
    // Distance formula: sqrt((lat2-lat1)² + (lng2-lng1)²) * 111 (approx km conversion)
    const hospitals = await this.databaseService.$queryRaw<any[]>`
      SELECT 
        h.id,
        h.name,
        h."institutionType",
        h.rating,
        l.address,
        l.city,
        l.state,
        l.latitude,
        l.longitude,
        SQRT(
          POWER(l.latitude - ${latitude}, 2) + 
          POWER(l.longitude - ${longitude}, 2)
        ) * 111 AS distance_km
      FROM "Hospital" h
      JOIN "Location" l ON h."locationId" = l.id
      WHERE SQRT(
        POWER(l.latitude - ${latitude}, 2) + 
        POWER(l.longitude - ${longitude}, 2)
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
  }) {
    const {
      institutionType,
      city,
      state,
      minRating,
      limit = 20,
      offset = 0,
    } = filters;

    const where: Record<string, any> = {};

    if (institutionType) {
      where.institutionType = institutionType;
    }

    if (city || state) {
      where.location = {};
      if (city) {
        (where.location as Record<string, any>).city = {
          contains: city,
          mode: 'insensitive',
        };
      }
      if (state) {
        (where.location as Record<string, any>).state = {
          contains: state,
          mode: 'insensitive',
        };
      }
    }

    if (minRating !== undefined) {
      where.rating = { gte: minRating };
    }

    return this.databaseService.hospital.findMany({
      where: where as any,
      include: {
        location: true,
        reviews: true,
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Private helper methods
   */

  private async _searchHospitals(
    searchTerm: string,
    limit: number,
    offset: number,
  ) {
    return this.databaseService.hospital.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        location: true,
        reviews: { select: { rating: true } },
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    } as any);
  }

  private async _searchDoctors(
    searchTerm: string,
    limit: number,
    offset: number,
  ) {
    return this.databaseService.doctor.findMany({
      where: {
        OR: [
          { firstName: { contains: searchTerm, mode: 'insensitive' } },
          { lastName: { contains: searchTerm, mode: 'insensitive' } },
          { specialization: { contains: searchTerm, mode: 'insensitive' } },
          { bio: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        reviews: { select: { rating: true } },
        institutions: {
          include: { hospital: { include: { location: true } } },
        },
      },
      take: limit,
      skip: offset,
    } as any);
  }

  private _escapeSearchTerm(term: string): string {
    // Escape special characters for PostgreSQL FTS
    return term.replace(/[&|!()'"<>*]/g, '\\$&').trim();
  }
}
