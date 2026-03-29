import { ReviewRepository } from './review.repository';
import { DefaultRatingStrategy } from './strategies/default-rating.strategy';
export declare class ReviewService {
    private readonly reviewRepo;
    private readonly ratingStrategy;
    constructor(reviewRepo: ReviewRepository, ratingStrategy: DefaultRatingStrategy);
    submitReview(data: any): Promise<{
        id: string;
        createdAt: Date;
        rating: number;
        text: string | null;
        authorId: string;
        hospitalId: string | null;
        doctorId: string | null;
    }>;
    getHospitalReviews(hospitalId: string): Promise<{
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
    getDoctorReviews(doctorId: string): Promise<{
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
}
