import { BaseRepository } from '../common/repositories/base.repository';
import { Doctor } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class DoctorRepository extends BaseRepository<Doctor> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    searchDoctors(query?: string): Promise<Doctor[]>;
}
