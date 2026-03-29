import { DatabaseService } from '../database/database.service';
export declare class FavouritesService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    addToFavourites(userId: string, hospitalId: string): Promise<{
        id: string;
        hospitalId: string;
        userId: string;
        addedAt: Date;
    }>;
    removeFromFavourites(userId: string, hospitalId: string): Promise<void>;
    getUserFavourites(userId: string): Promise<({
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
        };
    } & {
        id: string;
        hospitalId: string;
        userId: string;
        addedAt: Date;
    })[]>;
    isFavourite(userId: string, hospitalId: string): Promise<boolean>;
    getFavouriteCount(hospitalId: string): Promise<number>;
}
