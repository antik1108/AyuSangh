import { Injectable } from '@nestjs/common';
import { InstitutionType, Review } from '@prisma/client';
import { AggregatedScore, IRatingStrategy } from './interfaces/rating-strategy.interface';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';

/**
 * RatingContext — Strategy Pattern context class (§3.1 Pattern 2)
 *
 * Selects the correct IRatingStrategy at runtime based on institution type.
 * New strategies for specific institution types (e.g. DiagnosticCentreRatingStrategy)
 * can be registered without modifying this class — Open/Closed Principle.
 *
 * @example
 * const score = ratingContext.calculate(reviews, InstitutionType.HOSPITAL);
 */
@Injectable()
export class RatingContext {
  private readonly strategies = new Map<InstitutionType, IRatingStrategy>();

  constructor(private readonly defaultStrategy: DefaultRatingStrategy) {}

  /**
   * Register a custom strategy for a specific institution type.
   * If no strategy is registered for a type, the default is used.
   */
  register(type: InstitutionType, strategy: IRatingStrategy): void {
    this.strategies.set(type, strategy);
  }

  /**
   * Calculate aggregated scores using the appropriate strategy.
   * Falls back to DefaultRatingStrategy if no type-specific strategy is registered.
   */
  calculate(reviews: Review[], institutionType?: InstitutionType): AggregatedScore {
    const strategy =
      (institutionType && this.strategies.get(institutionType)) ??
      this.defaultStrategy;

    return strategy.calculateAverage(reviews);
  }
}
