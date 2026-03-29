import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, DefaultRatingStrategy],
  exports: [ReviewService]
})
export class ReviewModule {}
