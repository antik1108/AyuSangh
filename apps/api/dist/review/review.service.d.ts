import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { DatabaseService } from '../database/database.service';
export declare class ReviewService {
    private readonly reviewRepo;
    private readonly ratingStrategy;
    private readonly databaseService;
    constructor(reviewRepo: ReviewRepository, ratingStrategy: DefaultRatingStrategy, databaseService: DatabaseService);
    submitReview(userId: string, data: SubmitReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    getHospitalReviews(hospitalId: string): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            text: string | null;
            authorId: string;
            hospitalId: string | null;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        }[];
        averageScore: number;
        totalReviews: number;
    }>;
    getDoctorReviews(doctorId: string): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            rating: number;
            text: string | null;
            authorId: string;
            hospitalId: string | null;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        }[];
        averageScore: number;
        totalReviews: number;
    }>;
    deleteReview(reviewId: string, userId: string, userRole: string): Promise<{
        message: string;
    }>;
    updateReview(reviewId: string, userId: string, updates: {
        rating?: number;
        text?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    approveReview(reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    rejectReview(reviewId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    replyToReview(reviewId: string, replyText: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    getPendingReviews(): Promise<({
        hospital: {
            name: string;
            id: string;
        } | null;
        doctor: {
            id: string;
            firstName: string;
            lastName: string;
        } | null;
        author: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    })[]>;
}
