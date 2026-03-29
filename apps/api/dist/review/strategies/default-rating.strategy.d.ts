import { IRatingStrategy } from '../interfaces/rating-strategy.interface';
import { Review } from '@prisma/client';
export declare class DefaultRatingStrategy implements IRatingStrategy {
    calculateScore(reviews: Review[]): number;
}
