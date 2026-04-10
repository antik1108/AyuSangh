import { DatabaseService } from '../database/database.service';
export declare class FavouritesService {
    private databaseService;
    constructor(databaseService: DatabaseService);
    addToFavourites(userId: string, hospitalId: string): unknown;
    removeFromFavourites(userId: string, hospitalId: string): Promise<void>;
    getUserFavourites(userId: string): unknown;
    isFavourite(userId: string, hospitalId: string): Promise<boolean>;
    getFavouriteCount(hospitalId: string): Promise<number>;
}
