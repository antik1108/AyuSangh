import { DoctorRepository } from './doctor.repository';
export declare class DoctorService {
    private readonly doctorRepo;
    constructor(doctorRepo: DoctorRepository);
    search(specialization?: string): Promise<{
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
    }[]>;
    getProfile(id: string): Promise<{
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
    } | null>;
    registerDoctor(data: any): Promise<{
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
    }>;
}
