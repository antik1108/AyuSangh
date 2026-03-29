import { HospitalRepository } from './hospital.repository';
import { DatabaseService } from '../database/database.service';
interface UploadResult {
    url: string;
    publicId: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
}
export declare class HospitalService {
    private readonly hospitalRepo;
    private readonly prisma;
    constructor(hospitalRepo: HospitalRepository, prisma: DatabaseService);
    search(name?: string, city?: string): Promise<{
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
    getRepo(): HospitalRepository;
    getProfile(id: string): Promise<{
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
    registerHospital(data: any): Promise<{
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
    updateProfilePhoto(hospitalId: string, photoUrl: string): Promise<{
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
    addImages(hospitalId: string, uploadResults: UploadResult[]): Promise<{
        id: string;
        imageUrl: string;
        altText: string | null;
        isProfilePhoto: boolean;
        uploadedAt: Date;
        hospitalId: string;
    }[]>;
    deleteImage(hospitalId: string, imageId: string): Promise<{
        id: string;
        imageUrl: string;
        altText: string | null;
        isProfilePhoto: boolean;
        uploadedAt: Date;
        hospitalId: string;
    }>;
}
export {};
