import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { CommunityPost } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommunityRepository extends BaseRepository<CommunityPost> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.communityPost);
  }
}
