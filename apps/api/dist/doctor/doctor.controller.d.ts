import { DoctorService } from './doctor.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
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
        phone: string | null;
        isActive: boolean;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
        qualifications: string[];
        consultationFee: number | null;
    }[]>;
    getDoctor(id: string): Promise<{
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
