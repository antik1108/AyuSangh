import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { RatingContext } from './strategies/rating.context';
import { HospitalRatingStrategy } from './strategies/hospital-rating.strategy';
import { LabRatingStrategy } from './strategies/lab-rating.strategy';
import { HospitalModule } from '../hospital/hospital.module';

@Module({
  imports: [HospitalModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ReviewRepository,
    RatingContext,
    HospitalRatingStrategy,
    LabRatingStrategy,
  ],
})
export class ReviewModule {
  constructor(
    private readonly ratingContext: RatingContext,
    private readonly hospitalRatingStrategy: HospitalRatingStrategy,
    private readonly labRatingStrategy: LabRatingStrategy,
  ) {
    this.ratingContext.register('HOSPITAL', this.hospitalRatingStrategy);
    this.ratingContext.register('LABORATORY', this.labRatingStrategy);
    // Other types will fallback to the DefaultRatingStrategy if not registered
  }
}
