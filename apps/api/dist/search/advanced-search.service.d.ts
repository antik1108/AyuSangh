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
    }): Promise<({
        location: {
            id: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
        };
        reviews: {
            rating: number;
        }[];
    } & {
        name: string;
        id: string;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        rating: number | null;
        isActive: boolean;
        phone: string | null;
        website: string | null;
        email: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    advancedDoctorSearch(options: {
        query?: string;
        specialization?: string;
        city?: string;
        minRating?: number;
        maxRating?: number;
        institutionId?: string;
        limit?: number;
        offset?: number;
    }): Promise<({
        reviews: {
            rating: number;
        }[];
        institutions: ({
            hospital: {
                location: {
                    id: string;
                    address: string;
                    city: string;
                    state: string;
                    zipCode: string;
                    country: string;
                    latitude: number | null;
                    longitude: number | null;
                };
            } & {
                name: string;
                id: string;
                description: string | null;
                institutionType: import("@prisma/client").$Enums.InstitutionType;
                adminId: string;
                locationId: string;
                rating: number | null;
                isActive: boolean;
                phone: string | null;
                website: string | null;
                email: string | null;
                profilePhoto: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            hospitalId: string;
            doctorId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        isActive: boolean;
        phone: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
    })[]>;
    getTrendingSearches(limit?: number): Promise<string[]>;
    findNearby(options: {
        latitude: number;
        longitude: number;
        radiusKm?: number;
        limit?: number;
    }): Promise<any[]>;
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
    }): Promise<({
        location: {
            id: string;
            address: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
            latitude: number | null;
            longitude: number | null;
        };
        reviews: {
            id: string;
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            hospitalId: string | null;
            text: string | null;
            authorId: string;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        }[];
    } & {
        name: string;
        id: string;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        rating: number | null;
        isActive: boolean;
        phone: string | null;
        website: string | null;
        email: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    private _searchHospitals;
    private _searchDoctors;
    private _escapeSearchTerm;
}
export {};
