import { BaseRepository } from '../common/repositories/base.repository';
import { CommunityPost } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
export declare class CommunityRepository extends BaseRepository<CommunityPost> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
}
