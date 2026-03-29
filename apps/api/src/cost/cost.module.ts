import { Module } from '@nestjs/common';
import { CostService } from './cost.service';
import { CostController } from './cost.controller';
import { CostRepository } from './cost.repository';

@Module({
  controllers: [CostController],
  providers: [CostService, CostRepository]
})
export class CostModule {}
