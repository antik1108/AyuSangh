import { IRatingStrategy, AggregatedRating } from './rating-strategy.interface';
import { Review } from '@prisma/client';

export class DefaultRatingStrategy implements IRatingStrategy {
  calculateAverage(reviews: Review[]): AggregatedRating {
    if (reviews.length === 0) {
      return { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0, totalReviews: 0 };
    }

    const totals = reviews.reduce(
      (acc, review) => {
        acc.overall += review.overallRating;
        acc.cleanliness += review.cleanlinessRating;
        acc.staffBehaviour += review.staffRating;
        acc.waitTime += review.waitTimeRating;
        return acc;
      },
      { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0 },
    );

    const count = reviews.length;

    return {
      overall: Number((totals.overall / count).toFixed(2)),
      cleanliness: Number((totals.cleanliness / count).toFixed(2)),
      staffBehaviour: Number((totals.staffBehaviour / count).toFixed(2)),
      waitTime: Number((totals.waitTime / count).toFixed(2)),
      totalReviews: count,
    };
  }
}
