import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { AggregatedScore, IRatingStrategy } from '../interfaces/rating-strategy.interface';

/**
 * DefaultRatingStrategy
 *
 * Calculates a simple arithmetic mean across all four rating dimensions.
 * Used for all institution types unless a specialised strategy is registered
 * in RatingContext.
 *
 * All averages are rounded to one decimal place (e.g. 4.3).
 */
@Injectable()
export class DefaultRatingStrategy implements IRatingStrategy {
  calculateAverage(reviews: Review[]): AggregatedScore {
    const count = reviews?.length ?? 0;

    if (count === 0) {
      return { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0, reviewCount: 0 };
    }

    const round = (n: number) => Math.round((n / count) * 10) / 10;

    const totals = reviews.reduce(
      (acc, r) => ({
        overall:        acc.overall        + r.ratingOverall,
        cleanliness:    acc.cleanliness    + r.ratingCleanliness,
        staffBehaviour: acc.staffBehaviour + r.ratingStaffBehaviour,
        waitTime:       acc.waitTime       + r.ratingWaitTime,
      }),
      { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0 },
    );

    return {
      overall:        round(totals.overall),
      cleanliness:    round(totals.cleanliness),
      staffBehaviour: round(totals.staffBehaviour),
      waitTime:       round(totals.waitTime),
      reviewCount:    count,
    };
  }
}
