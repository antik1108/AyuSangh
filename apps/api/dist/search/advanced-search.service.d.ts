import { DatabaseService } from '../database/database.service';
import type { Hospital, Doctor, Review, Location } from '@prisma/client';
export interface HospitalSearchResult extends Hospital {
    location: Location;
    reviews: Review[];
}
export interface DoctorSearchResult extends Doctor {
    reviews: Review[];
    institutions: Array<{
        id: string;
        doctorId: string;
        hospitalId: string;
        joinedAt: Date;
        hospital: Hospital & {
            location: Location;
        };
    }>;
}
export interface SearchResult {
    hospital?: HospitalSearchResult[];
    doctor?: DoctorSearchResult[];
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
    }): Promise<HospitalSearchResult[]>;
    advancedDoctorSearch(options: {
        query?: string;
        specialization?: string;
        city?: string;
        minRating?: number;
        maxRating?: number;
        institutionId?: string;
        limit?: number;
        offset?: number;
    }): Promise<DoctorSearchResult[]>;
    getTrendingSearches(limit?: number): Promise<string[]>;
    findNearby(options: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
        limit?: number;
    }): Promise<Array<Hospital & {
        location: Location;
        distance_km?: number;
    }>>;
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
    }): Promise<HospitalSearchResult[]>;
    private _searchHospitals;
    private _searchDoctors;
    private _escapeSearchTerm;
}
export {};
