import { ReviewService } from './review.service';
import { SubmitReviewDto, UpdateReviewDto, ReplyToReviewDto } from './dto/submit-review.dto';
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
    getHospitalReviews(id: string): Promise<{
        reviews: {
            id: string;
            text: string | null;
            ratingOverall: number;
            ratingCleanliness: number;
            ratingStaffBehaviour: number;
            ratingWaitTime: number;
            authorId: string;
            hospitalId: string | null;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        score: import("./interfaces/rating-strategy.interface").AggregatedScore;
    }>;
    getDoctorReviews(id: string): Promise<{
        reviews: {
            id: string;
            text: string | null;
            ratingOverall: number;
            ratingCleanliness: number;
            ratingStaffBehaviour: number;
            ratingWaitTime: number;
            authorId: string;
            hospitalId: string | null;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        score: import("./interfaces/rating-strategy.interface").AggregatedScore;
    }>;
    submitReview(req: RequestWithUser, dto: SubmitReviewDto): Promise<{
        id: string;
        text: string | null;
        ratingOverall: number;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateReview(req: RequestWithUser, id: string, dto: UpdateReviewDto): Promise<{
        id: string;
        text: string | null;
        ratingOverall: number;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteReview(req: RequestWithUser, id: string): Promise<{
        message: string;
    }>;
    getPendingReviews(): Promise<{
        id: string;
        text: string | null;
        ratingOverall: number;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    approveReview(id: string): Promise<{
        id: string;
        text: string | null;
        ratingOverall: number;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    rejectReview(id: string): Promise<{
        id: string;
        text: string | null;
        ratingOverall: number;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    replyToReview(id: string, dto: ReplyToReviewDto): Promise<{
        id: string;
        text: string | null;
        ratingOverall: number;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
