"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const review_repository_1 = require("./review.repository");
const rating_context_1 = require("./rating.context");
const hospital_service_1 = require("../hospital/hospital.service");
let ReviewService = class ReviewService {
    reviewRepo;
    ratingContext;
    hospitalService;
    constructor(reviewRepo, ratingContext, hospitalService) {
        this.reviewRepo = reviewRepo;
        this.ratingContext = ratingContext;
        this.hospitalService = hospitalService;
    }
    async submitReview(userId, dto) {
        if (!dto.hospitalId && !dto.doctorId) {
            throw new common_1.BadRequestException('Either hospitalId or doctorId is required');
        }
        const existing = await this.reviewRepo.findFirstByAuthorAndEntity(userId, dto.hospitalId, dto.doctorId);
        if (existing) {
            throw new common_1.BadRequestException('You have already reviewed this entity. Use PUT to update your review.');
        }
        return this.reviewRepo.create({
            ratingOverall: dto.ratingOverall,
            ratingCleanliness: dto.ratingCleanliness,
            ratingStaffBehaviour: dto.ratingStaffBehaviour,
            ratingWaitTime: dto.ratingWaitTime,
            text: dto.text,
            status: client_1.ReviewStatus.PENDING,
            author: { connect: { id: userId } },
            ...(dto.hospitalId && { hospital: { connect: { id: dto.hospitalId } } }),
            ...(dto.doctorId && { doctor: { connect: { id: dto.doctorId } } }),
        });
    }
    async updateReview(reviewId, userId, dto) {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (review.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own reviews');
        }
        return this.reviewRepo.updateContent(reviewId, dto);
    }
    async deleteReview(reviewId, userId, userRole) {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        if (review.authorId !== userId && userRole !== 'PLATFORM_ADMIN') {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.reviewRepo.delete(reviewId);
        return { message: 'Review deleted successfully' };
    }
    async getHospitalReviews(hospitalId) {
        const reviews = await this.reviewRepo.findByHospital(hospitalId);
        const approved = reviews.filter((r) => r.status === client_1.ReviewStatus.APPROVED);
        const score = this.ratingContext.calculate(approved);
        return { reviews: approved, score };
    }
    async getDoctorReviews(doctorId) {
        const reviews = await this.reviewRepo.findByDoctor(doctorId);
        const approved = reviews.filter((r) => r.status === client_1.ReviewStatus.APPROVED);
        const score = this.ratingContext.calculate(approved);
        return { reviews: approved, score };
    }
    async getPendingReviews() {
        return this.reviewRepo.findPending();
    }
    async approveReview(reviewId) {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const updated = await this.reviewRepo.updateStatus(reviewId, client_1.ReviewStatus.APPROVED);
        if (review.hospitalId) {
            await this.hospitalService.recalculateAndPersistRating(review.hospitalId);
        }
        return updated;
    }
    async rejectReview(reviewId) {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const updated = await this.reviewRepo.updateStatus(reviewId, client_1.ReviewStatus.REJECTED);
        if (review.hospitalId) {
            await this.hospitalService.recalculateAndPersistRating(review.hospitalId);
        }
        return updated;
    }
    async replyToReview(reviewId, replyText) {
        const review = await this.reviewRepo.findById(reviewId);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return this.reviewRepo.addAdminReply(reviewId, replyText);
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository,
        rating_context_1.RatingContext,
        hospital_service_1.HospitalService])
], ReviewService);
//# sourceMappingURL=review.service.js.map