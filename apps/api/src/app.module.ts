import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { ReviewModule } from './review/review.module';
import { DoctorModule } from './doctor/doctor.module';
import { SearchModule } from './search/search.module';
import { CommunityModule } from './community/community.module';
import { CostModule } from './cost/cost.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    HospitalModule,
    ReviewModule,
    DoctorModule,
    SearchModule,
    CommunityModule,
    CostModule,
  ],
})
export class AppModule {}
