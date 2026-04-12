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
export declare class AdvancedSearchService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    search(options: SearchOptions): Promise<SearchResult>;
    advancedHospitalSearch(options: {
        query?: string;
        institutionType?: string;
        city?: string;
        state?: string;
        minRating?: number;
        maxRating?: number;
        limit?: number;
        offset?: number;
    }): unknown;
    advancedDoctorSearch(options: {
        query?: string;
        specialization?: string;
        city?: string;
        minRating?: number;
        maxRating?: number;
        institutionId?: string;
        limit?: number;
        offset?: number;
    }): unknown;
    getTrendingSearches(limit?: number): Promise<string[]>;
    findNearby(options: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
        limit?: number;
    }): unknown;
    getHospitalsByFilters(filters: {
        institutionType?: string;
        minBeds?: number;
        maxBeds?: number;
        hasOPD?: boolean;
        city?: string;
        state?: string;
        minRating?: number;
        limit?: number;
        offset?: number;
    }): unknown;
    private _searchHospitals;
    private _searchDoctors;
    private _escapeSearchTerm;
}
export {};
