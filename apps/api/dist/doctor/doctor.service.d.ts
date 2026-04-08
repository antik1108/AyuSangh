import { DoctorRepository } from './doctor.repository';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
export declare class DoctorService {
    private readonly doctorRepo;
    constructor(doctorRepo: DoctorRepository);
    search(specialization?: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        isActive: boolean;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
        qualifications: string[];
        consultationFee: number | null;
    }[]>;
    getProfile(id: string): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        isActive: boolean;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
        qualifications: string[];
        consultationFee: number | null;
    } | null>;
    registerDoctor(dto: RegisterDoctorDto): Promise<{
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        phone: string | null;
        isActive: boolean;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
        qualifications: string[];
        consultationFee: number | null;
    }>;
}
