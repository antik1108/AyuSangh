import { Review } from '@prisma/client';
export interface AggregatedScore {
    overall: number;
    cleanliness: number;
    staffBehaviour: number;
    waitTime: number;
    reviewCount: number;
}
export interface IRatingStrategy {
    calculateAverage(reviews: Review[]): AggregatedScore;
}
