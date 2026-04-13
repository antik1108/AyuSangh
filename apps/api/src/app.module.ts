import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { DoctorModule } from './doctor/doctor.module';
import { ReviewModule } from './review/review.module';
import { SearchModule } from './search/search.module';
import { CommunityModule } from './community/community.module';
import { CostModule } from './cost/cost.module';
import { AccreditationModule } from './accreditation/accreditation.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    HospitalModule,
    DoctorModule,
    ReviewModule,
    SearchModule,
    CommunityModule,
    CostModule,
    AccreditationModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
