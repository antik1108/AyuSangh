import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DoctorRepository } from './doctor.repository';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepository],
  exports: [DoctorService, DoctorRepository],
})
export class DoctorModule {}
