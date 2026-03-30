import { Review } from '@prisma/client';

/**
 * Aggregated multi-dimensional score returned by any rating strategy.
 * Matches FR-04.2 — four separate rating dimensions.
 */
export interface AggregatedScore {
  overall: number;
  cleanliness: number;
  staffBehaviour: number;
  waitTime: number;
  /** Total number of approved reviews used in the calculation */
  reviewCount: number;
}

/**
 * IRatingStrategy — Strategy Pattern interface (§3.1 Pattern 2)
 *
 * Concrete implementations can apply different weighting algorithms
 * per institution type (hospital vs. diagnostic lab vs. nursing home).
 * The RatingContext selects the correct strategy at runtime.
 */
export interface IRatingStrategy {
  /**
   * Calculate aggregated multi-dimensional scores from a set of approved reviews.
   * @param reviews - Array of APPROVED Review records
   * @returns AggregatedScore with per-dimension averages and review count
   */
  calculateAverage(reviews: Review[]): AggregatedScore;
}
