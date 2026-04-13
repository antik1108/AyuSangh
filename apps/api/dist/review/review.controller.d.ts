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
            ratingCleanliness: number;
            ratingStaffBehaviour: number;
            ratingWaitTime: number;
            createdAt: Date;
            updatedAt: Date;
            hospitalId: string | null;
            text: string | null;
            ratingOverall: number;
            authorId: string;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        }[];
        score: import("./interfaces/rating-strategy.interface").AggregatedScore;
    }>;
    getDoctorReviews(id: string): Promise<{
        reviews: {
            id: string;
            ratingCleanliness: number;
            ratingStaffBehaviour: number;
            ratingWaitTime: number;
            createdAt: Date;
            updatedAt: Date;
            hospitalId: string | null;
            text: string | null;
            ratingOverall: number;
            authorId: string;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        }[];
        score: import("./interfaces/rating-strategy.interface").AggregatedScore;
    }>;
    submitReview(req: RequestWithUser, dto: SubmitReviewDto): Promise<{
        id: string;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        ratingOverall: number;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    updateReview(req: RequestWithUser, id: string, dto: UpdateReviewDto): Promise<{
        id: string;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        ratingOverall: number;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    deleteReview(req: RequestWithUser, id: string): Promise<{
        message: string;
    }>;
    getPendingReviews(): Promise<{
        id: string;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        ratingOverall: number;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }[]>;
    approveReview(id: string): Promise<{
        id: string;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        ratingOverall: number;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    rejectReview(id: string): Promise<{
        id: string;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        ratingOverall: number;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    replyToReview(id: string, dto: ReplyToReviewDto): Promise<{
        id: string;
        ratingCleanliness: number;
        ratingStaffBehaviour: number;
        ratingWaitTime: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        ratingOverall: number;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
}
export {};
