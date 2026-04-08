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
    findImage(imageId: string): Promise<InstitutionImage | null>;
    deleteImage(imageId: string): Promise<InstitutionImage>;
}
