import { Injectable } from '@nestjs/common';
import { CommunityPost, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommunityRepository extends BaseRepository<
  CommunityPost,
  Prisma.CommunityPostCreateInput | Prisma.CommunityPostUncheckedCreateInput,
  Prisma.CommunityPostUpdateInput | Prisma.CommunityPostUncheckedUpdateInput
> {
  constructor(db: DatabaseService) {
    super(db);
  }

  protected get model() {
    return this.db.communityPost;
  }
}
