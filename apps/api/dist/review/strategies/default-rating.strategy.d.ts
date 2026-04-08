import { Review } from '@prisma/client';
import { AggregatedScore, IRatingStrategy } from '../interfaces/rating-strategy.interface';
export declare class DefaultRatingStrategy implements IRatingStrategy {
    calculateAverage(reviews: Review[]): AggregatedScore;
}
