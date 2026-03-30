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
        email: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        rating: number | null;
        isActive: boolean;
        phone: string | null;
        website: string | null;
    } & {
        location: import("@prisma/client").Location;
        distance_km?: number;
    })[]>;
    getHospitalsByFilters(type: string, city: string, state: string, minRating: number, limit?: number, offset?: number): Promise<import("./advanced-search.service").HospitalSearchResult[]>;
    getTrending(limit?: number): Promise<string[]>;
}
