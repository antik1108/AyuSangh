import { Injectable } from '@nestjs/common';
import { IRatingStrategy } from '../interfaces/rating-strategy.interface';
import { Review } from '@prisma/client';

@Injectable()
export class DefaultRatingStrategy implements IRatingStrategy {
  calculateScore(reviews: Review[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  }
}
