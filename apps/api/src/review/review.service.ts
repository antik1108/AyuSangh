import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';
import { SubmitReviewDto, ReplyToReviewDto } from './dto/submit-review.dto';
import { DatabaseService } from '../database/database.service';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly ratingStrategy: DefaultRatingStrategy,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Submit a new review with uniqueness constraint
   */
  async submitReview(userId: string, data: SubmitReviewDto) {
    if (!data.hospitalId && !data.doctorId) {
      throw new BadRequestException('Either hospitalId or doctorId is required');
    }

    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this entity
    const existingReview = await this.databaseService.review.findFirst({
      where: {
        authorId: userId,
        hospitalId: data.hospitalId || undefined,
        doctorId: data.doctorId || undefined,
      },
    });

    if (existingReview) {
      throw new BadRequestException(
        'You have already reviewed this entity. Use update or delete instead.',
      );
    }

    return this.reviewRepo.create({
      ...data,
      author: { connect: { id: userId } },
      status: ReviewStatus.PENDING, // New reviews are pending moderation
    } as any);
  }

  /**
   * Get all reviews for a hospital with average score
   */
  async getHospitalReviews(hospitalId: string) {
    const reviews = await this.reviewRepo.findByHospital(hospitalId);
    const approvedReviews = reviews.filter(r => r.status === ReviewStatus.APPROVED);
    const score = this.ratingStrategy.calculateScore(approvedReviews);
    
    return { 
      reviews: approvedReviews,
      averageScore: score,
      totalReviews: approvedReviews.length,
    };
  }

  /**
   * Get all reviews for a doctor with average score
   */
  async getDoctorReviews(doctorId: string) {
    const reviews = await this.reviewRepo.findByDoctor(doctorId);
    const approvedReviews = reviews.filter(r => r.status === ReviewStatus.APPROVED);
    const score = this.ratingStrategy.calculateScore(approvedReviews);
    
    return { 
      reviews: approvedReviews,
      averageScore: score,
      totalReviews: approvedReviews.length,
    };
  }

  /**
   * Delete a review (only by author or admin)
   */
  async deleteReview(reviewId: string, userId: string, userRole: string) {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.authorId !== userId && userRole !== 'PLATFORM_ADMIN') {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.databaseService.review.delete({
      where: { id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }

  /**
   * Update a review (only by author)
   */
  async updateReview(
    reviewId: string,
    userId: string,
    updates: { rating?: number; text?: string },
  ) {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.authorId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    return this.databaseService.review.update({
      where: { id: reviewId },
      data: {
        ...updates,
        status: ReviewStatus.PENDING, // Re-submit for moderation after update
      },
    });
  }

  /**
   * Approve a review (admin only)
   */
  async approveReview(reviewId: string) {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.databaseService.review.update({
      where: { id: reviewId },
      data: { status: ReviewStatus.APPROVED },
    });
  }

  /**
   * Reject a review (admin only)
   */
  async rejectReview(reviewId: string) {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.databaseService.review.update({
      where: { id: reviewId },
      data: { status: ReviewStatus.REJECTED },
    });
  }

  /**
   * Add admin reply to a review
   */
  async replyToReview(reviewId: string, replyText: string) {
    const review = await this.databaseService.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.databaseService.review.update({
      where: { id: reviewId },
      data: {
        adminReply: replyText,
        adminReplyAt: new Date(),
      },
    });
  }

  /**
   * Get pending reviews for moderation (admin only)
   */
  async getPendingReviews() {
    return this.databaseService.review.findMany({
      where: { status: ReviewStatus.PENDING },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        hospital: {
          select: { id: true, name: true },
        },
        doctor: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
