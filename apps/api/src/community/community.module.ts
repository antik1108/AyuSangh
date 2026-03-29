import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { CommunityRepository } from './community.repository';

@Module({
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository]
})
export class CommunityModule {}
