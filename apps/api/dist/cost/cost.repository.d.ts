import { BaseRepository } from '../common/repositories/base.repository';
import { Cost, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class CostRepository extends BaseRepository<Cost, Prisma.CostCreateInput, Prisma.CostUpdateInput> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
}
