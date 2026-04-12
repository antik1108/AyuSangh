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
const review_repository_1 = require("./review.repository");
const default_rating_strategy_1 = require("./strategies/default-rating.strategy");
const database_service_1 = require("../database/database.service");
const client_1 = require("@prisma/client");
let ReviewService = class ReviewService {
    reviewRepo;
    ratingStrategy;
    databaseService;
    constructor(reviewRepo, ratingStrategy, databaseService) {
        this.reviewRepo = reviewRepo;
        this.ratingStrategy = ratingStrategy;
        this.databaseService = databaseService;
    }
    async submitReview(userId, data) {
        if (!data.hospitalId && !data.doctorId) {
            throw new common_1.BadRequestException('Either hospitalId or doctorId is required');
        }
        if (data.rating < 1 || data.rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        const existingReview = await this.databaseService.review.findFirst({
            where: {
                authorId: userId,
                hospitalId: data.hospitalId || undefined,
                doctorId: data.doctorId || undefined,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this entity. Use update or delete instead.');
        }
        return this.reviewRepo.create({
            ...data,
            author: { connect: { id: userId } },
            status: client_1.ReviewStatus.PENDING,
        });
    }
    async getHospitalReviews(hospitalId) {
        const reviews = await this.reviewRepo.findByHospital(hospitalId);
        const approvedReviews = reviews.filter(r => r.status === client_1.ReviewStatus.APPROVED);
        const score = this.ratingStrategy.calculateScore(approvedReviews);
        return {
            reviews: approvedReviews,
            averageScore: score,
            totalReviews: approvedReviews.length,
        };
    }
    async getDoctorReviews(doctorId) {
        const reviews = await this.reviewRepo.findByDoctor(doctorId);
        const approvedReviews = reviews.filter(r => r.status === client_1.ReviewStatus.APPROVED);
        const score = this.ratingStrategy.calculateScore(approvedReviews);
        return {
            reviews: approvedReviews,
            averageScore: score,
            totalReviews: approvedReviews.length,
        };
    }
    async getReviewsByAuthor(userId) {
        return this.databaseService.review.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                hospital: { select: { id: true, name: true } },
                doctor: { select: { id: true, firstName: true, lastName: true } },
            },
        });
    }
    async getHospitalReviewsForManagement(hospitalId, userId, role) {
        const hospital = await this.databaseService.hospital.findUnique({
            where: { id: hospitalId },
        });
        if (!hospital) {
            throw new common_1.NotFoundException('Hospital not found');
        }
        if (role !== 'PLATFORM_ADMIN' && hospital.adminId !== userId) {
            throw new common_1.ForbiddenException('Not authorized to manage this hospital');
        }
        const reviews = await this.databaseService.review.findMany({
            where: { hospitalId },
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, email: true, firstName: true, lastName: true },
                },
            },
        });
        return { reviews };
    }
    async deleteReview(reviewId, userId, userRole) {
        const review = await this.databaseService.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.authorId !== userId && userRole !== 'PLATFORM_ADMIN') {
            throw new common_1.ForbiddenException('You can only delete your own reviews');
        }
        await this.databaseService.review.delete({
            where: { id: reviewId },
        });
        return { message: 'Review deleted successfully' };
    }
    async updateReview(reviewId, userId, updates) {
        const review = await this.databaseService.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        if (review.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own reviews');
        }
        if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        return this.databaseService.review.update({
            where: { id: reviewId },
            data: {
                ...updates,
                status: client_1.ReviewStatus.PENDING,
            },
        });
    }
    async approveReview(reviewId) {
        const review = await this.databaseService.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return this.databaseService.review.update({
            where: { id: reviewId },
            data: { status: client_1.ReviewStatus.APPROVED },
        });
    }
    async rejectReview(reviewId) {
        const review = await this.databaseService.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return this.databaseService.review.update({
            where: { id: reviewId },
            data: { status: client_1.ReviewStatus.REJECTED },
        });
    }
    async replyToReview(reviewId, replyText) {
        const review = await this.databaseService.review.findUnique({
            where: { id: reviewId },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return this.databaseService.review.update({
            where: { id: reviewId },
            data: {
                adminReply: replyText,
                adminReplyAt: new Date(),
            },
        });
    }
    async getPendingReviews() {
        return this.databaseService.review.findMany({
            where: { status: client_1.ReviewStatus.PENDING },
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
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository,
        default_rating_strategy_1.DefaultRatingStrategy,
        database_service_1.DatabaseService])
], ReviewService);
//# sourceMappingURL=review.service.js.map