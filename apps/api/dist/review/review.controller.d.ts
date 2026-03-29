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
    getHospitalReviews(id: string): Promise<{
        reviews: {
            id: string;
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            hospitalId: string | null;
            text: string | null;
            authorId: string;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        }[];
        averageScore: number;
        totalReviews: number;
    }>;
    getDoctorReviews(id: string): Promise<{
        reviews: {
            id: string;
            rating: number;
            createdAt: Date;
            updatedAt: Date;
            hospitalId: string | null;
            text: string | null;
            authorId: string;
            doctorId: string | null;
            status: import("@prisma/client").$Enums.ReviewStatus;
            adminReply: string | null;
            adminReplyAt: Date | null;
        }[];
        averageScore: number;
        totalReviews: number;
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
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    })[]>;
    submitReview(req: RequestWithUser, data: SubmitReviewDto): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    updateReview(req: RequestWithUser, id: string, updates: {
        rating?: number;
        text?: string;
    }): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    deleteReview(req: RequestWithUser, id: string): Promise<{
        message: string;
    }>;
    approveReview(id: string): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    rejectReview(id: string): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
    replyToReview(id: string, body: ReplyToReviewDto): Promise<{
        id: string;
        rating: number;
        createdAt: Date;
        updatedAt: Date;
        hospitalId: string | null;
        text: string | null;
        authorId: string;
        doctorId: string | null;
        status: import("@prisma/client").$Enums.ReviewStatus;
        adminReply: string | null;
        adminReplyAt: Date | null;
    }>;
}
export {};
