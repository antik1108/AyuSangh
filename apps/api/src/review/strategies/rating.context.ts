import { Injectable } from '@nestjs/common';
import { IRatingStrategy, AggregatedRating } from './rating-strategy.interface';
import { DefaultRatingStrategy } from './default-rating.strategy';
import { InstitutionType } from '../../hospital/dto/search-hospital.dto';
import { Review } from '@prisma/client';

@Injectable()
export class RatingContext {
  private strategies: Map<string, IRatingStrategy> = new Map();
  private defaultStrategy: IRatingStrategy = new DefaultRatingStrategy();

  register(type: string, strategy: IRatingStrategy): void {
    this.strategies.set(type.toUpperCase(), strategy);
  }

  calculate(reviews: Review[], type: string): AggregatedRating {
    const strategy = this.strategies.get(type.toUpperCase()) || this.defaultStrategy;
    return strategy.calculateAverage(reviews);
  }
}
