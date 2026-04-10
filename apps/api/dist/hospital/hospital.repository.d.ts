import { BaseRepository } from '../common/repositories/base.repository';
import { Hospital, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class HospitalRepository extends BaseRepository<Hospital, Prisma.HospitalCreateInput, Prisma.HospitalUpdateInput> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    searchHospitals(nameQuery?: string, cityQuery?: string): Promise<Hospital[]>;
}
