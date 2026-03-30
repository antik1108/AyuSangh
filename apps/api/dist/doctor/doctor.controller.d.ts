import { DoctorService } from './doctor.service';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: DoctorService);
    searchDoctors(specialization?: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
    }[]>;
    getDoctor(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
    } | null>;
    registerDoctor(data: any): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        phone: string | null;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
    }>;
}
