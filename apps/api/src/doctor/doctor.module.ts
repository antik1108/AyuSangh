import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { DoctorRepository } from './doctor.repository';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepository],
  exports: [DoctorService]
})
export class DoctorModule {}
