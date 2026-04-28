import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { AdvancedSearchService } from './advanced-search.service';
import { HospitalModule } from '../hospital/hospital.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [HospitalModule, DoctorModule],
  controllers: [SearchController],
  providers: [SearchService, AdvancedSearchService],
})
export class SearchModule {}
