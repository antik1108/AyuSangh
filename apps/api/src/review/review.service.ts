import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReviewStatus } from '@prisma/client';
import { ReviewRepository } from './review.repository';
import { RatingContext } from './rating.context';
import { SubmitReviewDto, UpdateReviewDto } from './dto/submit-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly ratingContext: RatingContext,
  ) {}

  // ─────────────────────────────────────────────
  // Public write operations
  // ─────────────────────────────────────────────

  async submitReview(userId: string, dto: SubmitReviewDto) {
    if (!dto.hospitalId && !dto.doctorId) {
      throw new BadRequestException('Either hospitalId or doctorId is required');
    }

    const existing = await this.reviewRepo.findFirstByAuthorAndEntity(
      userId,
      dto.hospitalId,
      dto.doctorId,
    );

    if (existing) {
      throw new BadRequestException(
        'You have already reviewed this entity. Use PUT to update your review.',
      );
    }

    return this.reviewRepo.create({
      ratingOverall:        dto.ratingOverall,
      ratingCleanliness:    dto.ratingCleanliness,
      ratingStaffBehaviour: dto.ratingStaffBehaviour,
      ratingWaitTime:       dto.ratingWaitTime,
      text:                 dto.text,
      status:               ReviewStatus.PENDING,
      author:               { connect: { id: userId } },
      ...(dto.hospitalId && { hospital: { connect: { id: dto.hospitalId } } }),
      ...(dto.doctorId   && { doctor:   { connect: { id: dto.doctorId   } } }),
    });
  }

  async updateReview(reviewId: string, userId: string, dto: UpdateReviewDto) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    if (review.authorId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }
    return this.reviewRepo.updateContent(reviewId, dto);
  }

  async deleteReview(reviewId: string, userId: string, userRole: string) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');

    if (review.authorId !== userId && userRole !== 'PLATFORM_ADMIN') {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepo.delete(reviewId);
    return { message: 'Review deleted successfully' };
  }

  // ─────────────────────────────────────────────
  // Public read operations
  // ─────────────────────────────────────────────

  async getHospitalReviews(hospitalId: string) {
    const reviews = await this.reviewRepo.findByHospital(hospitalId);
    const approved = reviews.filter((r) => r.status === ReviewStatus.APPROVED);
    const score = this.ratingContext.calculate(approved);

    return { reviews: approved, score };
  }

  async getDoctorReviews(doctorId: string) {
    const reviews = await this.reviewRepo.findByDoctor(doctorId);
    const approved = reviews.filter((r) => r.status === ReviewStatus.APPROVED);
    const score = this.ratingContext.calculate(approved);

    return { reviews: approved, score };
  }

  async getPendingReviews() {
    return this.reviewRepo.findPending();
  }

  // ─────────────────────────────────────────────
  // Admin moderation
  // ─────────────────────────────────────────────

  async approveReview(reviewId: string) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    return this.reviewRepo.updateStatus(reviewId, ReviewStatus.APPROVED);
  }

  async rejectReview(reviewId: string) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    return this.reviewRepo.updateStatus(reviewId, ReviewStatus.REJECTED);
  }

  async replyToReview(reviewId: string, replyText: string) {
    const review = await this.reviewRepo.findById(reviewId);
    if (!review) throw new NotFoundException('Review not found');
    return this.reviewRepo.addAdminReply(reviewId, replyText);
  }
}
