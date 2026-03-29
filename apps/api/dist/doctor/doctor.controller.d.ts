import { DoctorService } from './doctor.service';
export declare class DoctorController {
    private readonly doctorService;
    constructor(doctorService: DoctorService);
    searchDoctors(specialization?: string): Promise<{
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
    getDoctor(id: string): Promise<{
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
