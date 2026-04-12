import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { DatabaseService } from '../database/database.service';
export declare class ReviewService {
    private readonly reviewRepo;
    private readonly ratingStrategy;
    private readonly databaseService;
    constructor(reviewRepo: ReviewRepository, ratingStrategy: DefaultRatingStrategy, databaseService: DatabaseService);
    submitReview(userId: string, data: SubmitReviewDto): unknown;
    getHospitalReviews(hospitalId: string): unknown;
    getDoctorReviews(doctorId: string): unknown;
    getReviewsByAuthor(userId: string): unknown;
    getHospitalReviewsForManagement(hospitalId: string, userId: string, role: string): unknown;
    deleteReview(reviewId: string, userId: string, userRole: string): unknown;
    updateReview(reviewId: string, userId: string, updates: {
        rating?: number;
        text?: string;
    }): unknown;
    approveReview(reviewId: string): unknown;
    rejectReview(reviewId: string): unknown;
    replyToReview(reviewId: string, replyText: string): unknown;
    getPendingReviews(): unknown;
}
