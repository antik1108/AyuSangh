import { Injectable } from '@nestjs/common';
import { CommunityRepository } from './community.repository';

@Injectable()
export class CommunityService {
  constructor(private readonly repo: CommunityRepository) {}

  getAllPosts() {
    return this.repo.findAll();
  }

  createPost(data: any) {
    return this.repo.create(data);
  }
}
