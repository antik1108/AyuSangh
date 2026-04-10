import { HospitalService } from './hospital.service';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import type { Request as ExpressRequest } from 'express';
interface RequestWithUser extends ExpressRequest {
    user: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare class InstitutionsController {
    private readonly hospitalService;
    constructor(hospitalService: HospitalService);
    listInstitutions(name?: string, city?: string, type?: string, minRating?: string): unknown;
    getInstitution(id: string): unknown;
    createInstitution(req: RequestWithUser, data: CreateInstitutionDto): unknown;
    updateInstitution(id: string, data: UpdateInstitutionDto): unknown;
}
export {};
