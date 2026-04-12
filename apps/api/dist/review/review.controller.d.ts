import { Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SubmitReviewDto, ReplyToReviewDto } from './dto/submit-review.dto';
interface RequestWithUser extends Request {
    user: {
        userId: string;
        email: string;
        role: string;
    };
}
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    getHospitalReviewsForManage(req: RequestWithUser, id: string): unknown;
    getHospitalReviews(id: string): unknown;
    getDoctorReviews(id: string): unknown;
    getPendingReviews(): unknown;
    getMyReviews(req: RequestWithUser): unknown;
    getInstitutionReviews(institutionId: string): unknown;
    submitReview(req: RequestWithUser, data: SubmitReviewDto): unknown;
    updateReview(req: RequestWithUser, id: string, updates: {
        rating?: number;
        text?: string;
    }): unknown;
    deleteReview(req: RequestWithUser, id: string): unknown;
    approveReview(id: string): unknown;
    rejectReview(id: string): unknown;
    replyToReview(id: string, body: ReplyToReviewDto): unknown;
}
export {};
