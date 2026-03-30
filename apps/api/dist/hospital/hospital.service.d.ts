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
        email: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        rating: number | null;
        isActive: boolean;
        phone: string | null;
        website: string | null;
    }[]>;
    getRepo(): HospitalRepository;
    getProfile(id: string): Promise<{
        name: string;
        id: string;
        email: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        rating: number | null;
        isActive: boolean;
        phone: string | null;
        website: string | null;
    } | null>;
    registerHospital(data: any): Promise<{
        name: string;
        id: string;
        email: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        rating: number | null;
        isActive: boolean;
        phone: string | null;
        website: string | null;
    }>;
    updateProfilePhoto(hospitalId: string, photoUrl: string): Promise<{
        name: string;
        id: string;
        email: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        institutionType: import("@prisma/client").$Enums.InstitutionType;
        adminId: string;
        locationId: string;
        rating: number | null;
        isActive: boolean;
        phone: string | null;
        website: string | null;
    }>;
    addImages(hospitalId: string, uploadResults: UploadResult[]): Promise<{
        id: string;
        hospitalId: string;
        imageUrl: string;
        altText: string | null;
        isProfilePhoto: boolean;
        uploadedAt: Date;
    }[]>;
    deleteImage(hospitalId: string, imageId: string): Promise<{
        id: string;
        hospitalId: string;
        imageUrl: string;
        altText: string | null;
        isProfilePhoto: boolean;
        uploadedAt: Date;
    }>;
}
export {};
