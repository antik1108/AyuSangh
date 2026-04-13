import { SearchService } from './search.service';
import { AdvancedSearchService, type SearchResult } from './advanced-search.service';
export declare class SearchController {
    private readonly searchService;
    private readonly advancedSearchService;
    constructor(searchService: SearchService, advancedSearchService: AdvancedSearchService);
    globalSearch(query: string): Promise<{
        hospitals: unknown[];
        doctors: unknown[];
    }> | {
        hospitals: never[];
        doctors: never[];
    };
    advancedSearch(query: string, type?: 'hospital' | 'doctor' | 'all', limit?: number, offset?: number): Promise<SearchResult>;
    advancedHospitalSearch(query: string, type: string, city: string, state: string, minRating: number, maxRating: number, limit?: number, offset?: number): Promise<import("./advanced-search.service").HospitalSearchResult[]>;
    advancedDoctorSearch(query: string, specialization: string, city: string, minRating: number, maxRating: number, institutionId: string, limit?: number, offset?: number): Promise<import("./advanced-search.service").DoctorSearchResult[]>;
    getNearbyHospitals(latitude: number, longitude: number, radiusKm?: number, limit?: number): Promise<({
        name: string;
        id: string;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        phone: string | null;
        website: string | null;
        email: string | null;
        bookingLink: string | null;
        pincode: string | null;
        services: string[];
        openingHours: string | null;
        rating: number | null;
        ratingCleanliness: number | null;
        ratingStaffBehaviour: number | null;
        ratingWaitTime: number | null;
        profilePhoto: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } & {
        location: import("@prisma/client").Location;
        distance_km?: number;
    })[]>;
    getHospitalsByFilters(type: string, city: string, state: string, minRating: number, limit?: number, offset?: number): Promise<import("./advanced-search.service").HospitalSearchResult[]>;
    getTrending(limit?: number): Promise<string[]>;
    cleanupTestData(): Promise<{
        message: string;
    }>;
}
