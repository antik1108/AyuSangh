import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { RatingContext } from './strategies/rating.context';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewStatus, Prisma } from '@prisma/client';
import { HospitalRepository } from '../hospital/hospital.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly hospitalRepository: HospitalRepository,
    private readonly ratingContext: RatingContext,
  ) {}

  async submitReview(userId: string, submitReviewDto: SubmitReviewDto) {
    if (submitReviewDto.hospitalId) {
      const existing = await this.reviewRepository.findDuplicate(userId, submitReviewDto.hospitalId);
      if (existing) {
        throw new ConflictException('You have already submitted a review for this hospital.');
      }
    }

    const review = await this.reviewRepository.create({
      userId,
      institutionId: submitReviewDto.hospitalId || '',
      doctorId: submitReviewDto.doctorId,
      text: submitReviewDto.text,
      overallRating: submitReviewDto.ratingOverall,
      cleanlinessRating: submitReviewDto.ratingCleanliness,
      staffRating: submitReviewDto.ratingStaffBehaviour,
      waitTimeRating: submitReviewDto.ratingWaitTime,
      status: ReviewStatus.PENDING,
    });

    if (submitReviewDto.hospitalId) {
      await this.recalculateRatings(submitReviewDto.hospitalId);
    }

    return review;
  }

  async recalculateRatings(hospitalId: string) {
    const hospital = await this.hospitalRepository.findById(hospitalId);
    if (!hospital) return;

    const approvedReviews = await this.reviewRepository.findByHospital(hospitalId);
    
    // Strategy Pattern in action
    const aggregatedRating = this.ratingContext.calculate(approvedReviews, hospital.type);

    await this.hospitalRepository.updateRatings(hospitalId, {
      averageRating: aggregatedRating.overall,
      overallAvg: aggregatedRating.overall,
      cleanlinessAvg: aggregatedRating.cleanliness,
      staffAvg: aggregatedRating.staffBehaviour,
      waitTimeAvg: aggregatedRating.waitTime,
      totalReviews: aggregatedRating.totalReviews,
    });
  }

  async approveReview(id: string) {
    const review = await this.reviewRepository.updateStatus(id, ReviewStatus.APPROVED);
    if (review.institutionId) {
      await this.recalculateRatings(review.institutionId);
    }
    return review;
  }

  async rejectReview(id: string) {
    return this.reviewRepository.updateStatus(id, ReviewStatus.REJECTED);
  }

  async deleteReview(id: string, userId: string, isAdmin: boolean) {
    const review = await this.reviewRepository.findById(id);
    if (!review) throw new NotFoundException('Review not found');

    if (!isAdmin && review.userId !== userId) {
      throw new ConflictException('You can only delete your own reviews');
    }

    await this.reviewRepository.update(id, { isDeleted: true });

    if (review.institutionId) {
      await this.recalculateRatings(review.institutionId);
    }

    return { success: true };
  }

  async updateReview(id: string, userId: string, updateDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findById(id);
    if (!review || review.userId !== userId) {
      throw new ConflictException('You can only update your own reviews');
    }

    const data: Prisma.ReviewUpdateInput = { status: ReviewStatus.PENDING }; // Back to pending on edit
    if (updateDto.text) data.text = updateDto.text;
    if (updateDto.ratingOverall) data.overallRating = updateDto.ratingOverall;
    if (updateDto.ratingCleanliness) data.cleanlinessRating = updateDto.ratingCleanliness;
    if (updateDto.ratingStaffBehaviour) data.staffRating = updateDto.ratingStaffBehaviour;
    if (updateDto.ratingWaitTime) data.waitTimeRating = updateDto.ratingWaitTime;

    const updated = await this.reviewRepository.update(id, data);

    if (updated.institutionId) {
      await this.recalculateRatings(updated.institutionId);
    }
    return updated;
  }

  async replyToReview(reviewId: string, text: string, adminUserId: string) {
    return this.reviewRepository.addReply(reviewId, text, adminUserId);
  }

  async getHospitalReviews(hospitalId: string) {
    return this.reviewRepository.findByHospital(hospitalId);
  }

  async getDoctorReviews(doctorId: string) {
    return this.reviewRepository.findByDoctor(doctorId);
  }

  async getPendingReviews() {
    return this.reviewRepository.findPending();
  }
}
