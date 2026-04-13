import { BaseRepository } from '../common/repositories/base.repository';
import { Hospital, InstitutionImage, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class HospitalRepository extends BaseRepository<Hospital, Prisma.HospitalCreateInput, Prisma.HospitalUpdateInput> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    searchHospitals(nameQuery?: string, cityQuery?: string): Promise<Hospital[]>;
    updateProfilePhoto(hospitalId: string, photoUrl: string): Promise<Hospital>;
    addImages(hospitalId: string, images: Array<{
        imageUrl: string;
        isProfilePhoto: boolean;
    }>): Promise<InstitutionImage[]>;
    updateInstitution(hospitalId: string, data: Prisma.HospitalUpdateInput): Promise<Hospital>;
    updateInstitutionRating(hospitalId: string, scores: {
        rating: number;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
    }): Promise<Hospital>;
    findApprovedReviews(hospitalId: string): Promise<{
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        ratingOverall: number;
    }[]>;
    findImage(imageId: string): Promise<InstitutionImage | null>;
    deleteImage(imageId: string): Promise<InstitutionImage>;
}
