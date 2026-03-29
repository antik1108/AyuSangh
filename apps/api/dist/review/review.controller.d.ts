import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    getHospitalReviews(id: string): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            rating: number;
            text: string | null;
            authorId: string;
            hospitalId: string | null;
            doctorId: string | null;
        }[];
        averageScore: number;
    }>;
    getDoctorReviews(id: string): Promise<{
        reviews: {
            id: string;
            createdAt: Date;
            rating: number;
            text: string | null;
            authorId: string;
            hospitalId: string | null;
            doctorId: string | null;
        }[];
        averageScore: number;
    }>;
    submitReview(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
    }>;
}
