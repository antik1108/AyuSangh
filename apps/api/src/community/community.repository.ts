import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { CommunityPost, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommunityRepository extends BaseRepository<
  CommunityPost,
  Prisma.CommunityPostCreateInput,
  Prisma.CommunityPostUpdateInput
> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.communityPost);
  }

  async findAll() {
    return this.prisma.communityPost.findMany({
      include: {
        author: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.CommunityPostCreateInput) {
    return this.prisma.communityPost.create({
      data,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      },
    });
  }
}
