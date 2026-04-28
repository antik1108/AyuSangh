import { Review } from '@prisma/client';

export interface AggregatedRating {
  overall: number;
  cleanliness: number;
  staffBehaviour: number;
  waitTime: number;
  totalReviews: number;
}

export interface IRatingStrategy {
  calculateAverage(reviews: Review[]): AggregatedRating;
}
