import { HospitalService } from './hospital.service';
import { FavouritesService } from './favourites.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import type { Request as ExpressRequest } from 'express';
import type { Express } from 'express';
interface RequestWithUser extends ExpressRequest {
    user: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare class HospitalController {
    private readonly hospitalService;
    private readonly favouritesService;
    private readonly cloudinaryService;
    constructor(hospitalService: HospitalService, favouritesService: FavouritesService, cloudinaryService: CloudinaryService);
    searchHospitals(name?: string, city?: string): unknown;
    getUserFavourites(req: RequestWithUser): unknown;
    getMyHospital(req: RequestWithUser): unknown;
    getHospital(id: string): unknown;
    registerHospital(data: RegisterHospitalDto): unknown;
    uploadProfilePhoto(req: RequestWithUser, hospitalId: string, file: Express.Multer.File): unknown;
    uploadMultipleImages(req: RequestWithUser, hospitalId: string, files: Express.Multer.File[]): unknown;
    deleteImage(hospitalId: string, imageId: string): unknown;
    addToFavourites(req: RequestWithUser, hospitalId: string): unknown;
    removeFromFavourites(req: RequestWithUser, hospitalId: string): unknown;
    isFavourite(req: RequestWithUser, hospitalId: string): unknown;
}
export {};
