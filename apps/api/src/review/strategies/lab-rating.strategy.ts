import { Injectable } from '@nestjs/common';
import { Review } from '@prisma/client';
import { AggregatedScore, IRatingStrategy } from '../interfaces/rating-strategy.interface';

/**
 * LabRatingStrategy
 *
 * Applies weighted scoring for diagnostic centres / labs, where cleanliness
 * and wait time are the dominant quality signals.
 *
 * Weights:
 *   overall        → 20%
 *   cleanliness    → 35%
 *   staffBehaviour → 15%
 *   waitTime       → 30%
 */
@Injectable()
export class LabRatingStrategy implements IRatingStrategy {
  private readonly weights = {
    overall:        0.20,
    cleanliness:    0.35,
    staffBehaviour: 0.15,
    waitTime:       0.30,
  };

  calculateAverage(reviews: Review[]): AggregatedScore {
    const count = reviews?.length ?? 0;

    if (count === 0) {
      return { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0, reviewCount: 0 };
    }

    const round = (n: number) => Math.round(n * 10) / 10;

    const totals = reviews.reduce(
      (acc, r) => ({
        overall:        acc.overall        + r.ratingOverall,
        cleanliness:    acc.cleanliness    + r.ratingCleanliness,
        staffBehaviour: acc.staffBehaviour + r.ratingStaffBehaviour,
        waitTime:       acc.waitTime       + r.ratingWaitTime,
      }),
      { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0 },
    );

    const avg = {
      overall:        totals.overall        / count,
      cleanliness:    totals.cleanliness    / count,
      staffBehaviour: totals.staffBehaviour / count,
      waitTime:       totals.waitTime       / count,
    };

    // Weighted composite overall score
    const weightedOverall =
      avg.overall        * this.weights.overall +
      avg.cleanliness    * this.weights.cleanliness +
      avg.staffBehaviour * this.weights.staffBehaviour +
      avg.waitTime       * this.weights.waitTime;

    return {
      overall:        round(weightedOverall),
      cleanliness:    round(avg.cleanliness),
      staffBehaviour: round(avg.staffBehaviour),
      waitTime:       round(avg.waitTime),
      reviewCount:    count,
    };
  }
}
