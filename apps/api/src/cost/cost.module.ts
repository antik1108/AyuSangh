import { Module } from '@nestjs/common';
import { CostService } from './cost.service';
import { CostController } from './cost.controller';
import { CostRepository } from './cost.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CostController],
  providers: [CostService, CostRepository],
})
export class CostModule {}
