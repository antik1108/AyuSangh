import { Module } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { HospitalRepository } from './hospital.repository';
import { FavouritesService } from './favourites.service';
import { DatabaseModule } from '../database/database.module';
import { CloudinaryService } from '../common/services/cloudinary.service';

@Module({
  imports: [DatabaseModule],
  controllers: [HospitalController],
  providers: [HospitalService, HospitalRepository, FavouritesService, CloudinaryService],
  exports: [HospitalService, FavouritesService],
})
export class HospitalModule {}
