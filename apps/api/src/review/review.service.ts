import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly ratingStrategy: DefaultRatingStrategy,
  ) {}

  async submitReview(data: any) {
    return this.reviewRepo.create(data);
  }

  async getHospitalReviews(hospitalId: string) {
    const reviews = await this.reviewRepo.findByHospital(hospitalId);
    const score = this.ratingStrategy.calculateScore(reviews);
    return { reviews, averageScore: score };
  }

  async getDoctorReviews(doctorId: string) {
    const reviews = await this.reviewRepo.findByDoctor(doctorId);
    const score = this.ratingStrategy.calculateScore(reviews);
    return { reviews, averageScore: score };
  }
}
