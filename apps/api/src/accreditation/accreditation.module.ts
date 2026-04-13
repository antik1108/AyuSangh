import { Module } from '@nestjs/common';
import { AccreditationController } from './accreditation.controller';
import { AccreditationService } from './accreditation.service';
import { AccreditationRepository } from './accreditation.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AccreditationController],
  providers: [AccreditationService, AccreditationRepository],
  exports: [AccreditationService],
})
export class AccreditationModule {}
