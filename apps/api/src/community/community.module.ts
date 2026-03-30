import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { CommunityRepository } from './community.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CommunityController],
  providers: [CommunityService, CommunityRepository],
})
export class CommunityModule {}
