import { DoctorRepository } from './doctor.repository';
import { DatabaseService } from '../database/database.service';
export declare class DoctorService {
    private readonly doctorRepo;
    private readonly prisma;
    constructor(doctorRepo: DoctorRepository, prisma: DatabaseService);
    search(specialization?: string): unknown;
    getProfile(id: string): unknown;
    registerDoctor(data: any): unknown;
}
