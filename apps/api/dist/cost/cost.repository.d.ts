import { BaseRepository } from '../common/repositories/base.repository';
import { Cost } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class CostRepository extends BaseRepository<Cost> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
}
