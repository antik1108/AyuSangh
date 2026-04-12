import { HospitalRepository } from './hospital.repository';
import { DatabaseService } from '../database/database.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
interface UploadResult {
    url: string;
    publicId: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
}
export declare class HospitalService {
    private readonly hospitalRepo;
    private readonly prisma;
    constructor(hospitalRepo: HospitalRepository, prisma: DatabaseService);
    search(name?: string, city?: string): unknown;
    getRepo(): HospitalRepository;
    getProfile(id: string): unknown;
    registerHospital(data: any): unknown;
    findHospitalByAdmin(adminUserId: string): unknown;
    listInstitutions(params: {
        name?: string;
        city?: string;
        type?: string;
        minRating?: number;
    }): unknown;
    getInstitutionById(id: string): unknown;
    createInstitution(adminUserId: string, data: CreateInstitutionDto): unknown;
    updateInstitution(id: string, data: UpdateInstitutionDto): unknown;
    updateProfilePhoto(hospitalId: string, photoUrl: string): unknown;
    addImages(hospitalId: string, uploadResults: UploadResult[]): unknown;
    deleteImage(hospitalId: string, imageId: string): unknown;
}
export {};
