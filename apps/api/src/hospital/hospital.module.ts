import { Module } from '@nestjs/common';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { HospitalRepository } from './hospital.repository';
import { FavouritesService } from './favourites.service';
import { CloudinaryService } from '../common/cloudinary.service';

@Module({
  controllers: [HospitalController],
  providers: [
    HospitalService,
    HospitalRepository,
    FavouritesService,
    CloudinaryService,
  ],
  exports: [HospitalService, HospitalRepository],
})
export class HospitalModule {}
