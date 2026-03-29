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
    advancedHospitalSearch(query: string, type: string, city: string, state: string, minRating: number, maxRating: number, limit?: number, offset?: number): Promise<({
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
    advancedDoctorSearch(query: string, specialization: string, city: string, minRating: number, maxRating: number, institutionId: string, limit?: number, offset?: number): Promise<({
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
    getNearbyHospitals(latitude: number, longitude: number, radiusKm?: number, limit?: number): Promise<any[]>;
    getHospitalsByFilters(type: string, city: string, state: string, minRating: number, limit?: number, offset?: number): Promise<({
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
    getTrending(limit?: number): Promise<string[]>;
}
