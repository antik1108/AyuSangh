export declare class SubmitReviewDto {
    rating: number;
    text?: string;
    hospitalId?: string;
    doctorId?: string;
}
export declare class ApproveReviewDto {
    reviewId: string;
}
export declare class RejectReviewDto {
    reviewId: string;
}
export declare class ReplyToReviewDto {
    reviewId: string;
    replyText: string;
}
