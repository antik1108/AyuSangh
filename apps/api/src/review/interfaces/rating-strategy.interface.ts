import { Review } from '@prisma/client';

export interface IRatingStrategy {
  calculateScore(reviews: Review[]): number;
}
