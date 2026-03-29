import { HospitalService } from './hospital.service';
import { FavouritesService } from './favourites.service';
import { CloudinaryService } from '../common/services/cloudinary.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import type { Request as ExpressRequest } from 'express';
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
    searchHospitals(name?: string, city?: string): Promise<{
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
    }[]>;
    getHospital(id: string): Promise<{
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
    } | null>;
    registerHospital(data: RegisterHospitalDto): Promise<{
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
    }>;
    uploadProfilePhoto(req: RequestWithUser, hospitalId: string, file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
        filename: string;
        size: number;
        mimeType: string;
        uploadedAt: Date;
        message: string;
        photoUrl: string;
    }>;
    uploadMultipleImages(req: RequestWithUser, hospitalId: string, files: Express.Multer.File[]): Promise<{
        message: string;
        images: import("../common/services/cloudinary.service").UploadResponse[];
    }>;
    deleteImage(hospitalId: string, imageId: string): Promise<{
        message: string;
    }>;
    addToFavourites(req: RequestWithUser, hospitalId: string): Promise<{
        id: string;
        hospitalId: string;
        userId: string;
        addedAt: Date;
    }>;
    removeFromFavourites(req: RequestWithUser, hospitalId: string): Promise<{
        message: string;
    }>;
    getUserFavourites(req: RequestWithUser): Promise<({
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
    isFavourite(req: RequestWithUser, hospitalId: string): Promise<{
        isFavourite: boolean;
    }>;
}
export {};
