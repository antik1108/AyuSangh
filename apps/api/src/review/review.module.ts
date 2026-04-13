import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';
import { HospitalRatingStrategy } from './strategies/hospital-rating.strategy';
import { LabRatingStrategy } from './strategies/lab-rating.strategy';
import { RatingContext } from './rating.context';
import { DatabaseModule } from '../database/database.module';
import { HospitalModule } from '../hospital/hospital.module';

@Module({
  imports: [DatabaseModule, HospitalModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ReviewRepository,
    DefaultRatingStrategy,
    HospitalRatingStrategy,
    LabRatingStrategy,
    RatingContext,
  ],
  exports: [ReviewService],
})
export class ReviewModule {}
