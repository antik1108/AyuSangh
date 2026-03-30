import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';
import { RatingContext } from './rating.context';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, DefaultRatingStrategy, RatingContext],
  exports: [ReviewService],
})
export class ReviewModule {}
