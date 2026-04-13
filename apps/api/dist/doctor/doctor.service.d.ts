import { DoctorRepository } from './doctor.repository';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
export declare class DoctorService {
    private readonly doctorRepo;
    constructor(doctorRepo: DoctorRepository);
    search(specialization?: string): Promise<{
        id: string;
        phone: string | null;
        profilePhoto: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
        qualifications: string[];
        consultationFee: number | null;
    }[]>;
    getProfile(id: string): Promise<({
        reviews: ({
            author: {
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            ratingCleanliness: number;
            ratingStaffBehaviour: number;
            ratingWaitTime: number;
            createdAt: Date;
            updatedAt: Date;
            hospitalId: string | null;
            text: string | null;
            ratingOverall: number;
            authorId: string;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        })[];
        institutions: ({
            hospital: {
                name: string;
                id: string;
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
            };
        } & {
            id: string;
            hospitalId: string;
            doctorId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        phone: string | null;
        profilePhoto: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
        qualifications: string[];
        consultationFee: number | null;
    }) | null>;
    registerDoctor(dto: RegisterDoctorDto): Promise<{
        id: string;
        phone: string | null;
        profilePhoto: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        userId: string | null;
        specialization: string;
        experienceYears: number;
        bio: string | null;
        qualifications: string[];
        consultationFee: number | null;
    }>;
}
