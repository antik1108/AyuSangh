import { IRatingStrategy, AggregatedRating } from './rating-strategy.interface';
import { Review } from '@prisma/client';

export class HospitalRatingStrategy implements IRatingStrategy {
  calculateAverage(reviews: Review[]): AggregatedRating {
    if (reviews.length === 0) {
      return { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0, totalReviews: 0 };
    }

    const count = reviews.length;

    const totals = reviews.reduce(
      (acc, review) => {
        acc.cleanliness += review.cleanlinessRating;
        acc.staffBehaviour += review.staffRating;
        acc.waitTime += review.waitTimeRating;
        acc.rawOverall += review.overallRating;
        return acc;
      },
      { cleanliness: 0, staffBehaviour: 0, waitTime: 0, rawOverall: 0 },
    );

    const avgCleanliness = totals.cleanliness / count;
    const avgStaff = totals.staffBehaviour / count;
    const avgWait = totals.waitTime / count;
    const avgRawOverall = totals.rawOverall / count;

    // Weight: cleanliness 30%, staffBehaviour 30%, waitTime 20%, overall 20%
    const weightedOverall =
      avgCleanliness * 0.3 + avgStaff * 0.3 + avgWait * 0.2 + avgRawOverall * 0.2;

    return {
      overall: Number(weightedOverall.toFixed(2)),
      cleanliness: Number(avgCleanliness.toFixed(2)),
      staffBehaviour: Number(avgStaff.toFixed(2)),
      waitTime: Number(avgWait.toFixed(2)),
      totalReviews: count,
    };
  }
}
