import { Injectable } from '@nestjs/common';
import { CommunityRepository } from './community.repository';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class CommunityService {
  constructor(private readonly communityRepository: CommunityRepository) {}

  async getAllPosts() {
    return this.communityRepository['model'].findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, role: true } } },
    });
  }

  async createPost(userId: string, dto: CreatePostDto) {
    return this.communityRepository.create({
      userId,
      text: dto.text,
    });
  }
}
