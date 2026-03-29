import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { AdvancedSearchService } from './advanced-search.service';
import { HospitalModule } from '../hospital/hospital.module';
import { DoctorModule } from '../doctor/doctor.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [HospitalModule, DoctorModule, DatabaseModule],
  controllers: [SearchController],
  providers: [SearchService, AdvancedSearchService],
  exports: [SearchService, AdvancedSearchService],
})
export class SearchModule {}
