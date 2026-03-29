import { BaseRepository } from '../common/repositories/base.repository';
import { CommunityPost, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class CommunityRepository extends BaseRepository<CommunityPost, Prisma.CommunityPostCreateInput, Prisma.CommunityPostUpdateInput> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
}
