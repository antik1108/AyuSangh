export declare class SubmitReviewDto {
    ratingOverall: number;
    ratingCleanliness: number;
    ratingStaffBehaviour: number;
    ratingWaitTime: number;
    text?: string;
    hospitalId?: string;
    doctorId?: string;
}
export declare class UpdateReviewDto {
    ratingOverall?: number;
    ratingCleanliness?: number;
    ratingStaffBehaviour?: number;
    ratingWaitTime?: number;
    text?: string;
}
export declare class ReplyToReviewDto {
    replyText: string;
}
