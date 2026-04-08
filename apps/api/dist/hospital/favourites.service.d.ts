import { DatabaseService } from '../database/database.service';
import { Favourite, Hospital, Location, Review } from '@prisma/client';
export interface FavouriteWithHospital extends Favourite {
    hospital: Hospital & {
        location: Location;
        reviews: Review[];
    };
}
export declare class FavouritesService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    addToFavourites(userId: string, hospitalId: string): Promise<Favourite>;
    removeFromFavourites(userId: string, hospitalId: string): Promise<void>;
    getUserFavourites(userId: string): Promise<FavouriteWithHospital[]>;
    isFavourite(userId: string, hospitalId: string): Promise<boolean>;
    getFavouriteCount(hospitalId: string): Promise<number>;
}
