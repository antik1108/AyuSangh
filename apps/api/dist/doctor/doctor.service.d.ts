import { DoctorRepository } from './doctor.repository';
export declare class DoctorService {
    private readonly doctorRepo;
    constructor(doctorRepo: DoctorRepository);
    search(specialization?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        firstName: string;
        lastName: string;
        specialization: string;
        experienceYears: number;
        bio: string | null;
    }[]>;
    getProfile(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        firstName: string;
        lastName: string;
        specialization: string;
        experienceYears: number;
        bio: string | null;
    } | null>;
    registerDoctor(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        firstName: string;
        lastName: string;
        specialization: string;
        experienceYears: number;
        bio: string | null;
    }>;
}
