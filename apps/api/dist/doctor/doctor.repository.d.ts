import { BaseRepository } from '../common/repositories/base.repository';
import { Doctor, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class DoctorRepository extends BaseRepository<Doctor, Prisma.DoctorCreateInput, Prisma.DoctorUpdateInput> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    searchDoctors(query?: string): Promise<Doctor[]>;
    findById(id: string): Promise<({
        reviews: ({
            author: {
                email: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ratingCleanliness: number;
            ratingStaffBehaviour: number;
            ratingWaitTime: number;
            text: string | null;
            ratingOverall: number;
            authorId: string;
            hospitalId: string | null;
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
    }) | null>;
}
