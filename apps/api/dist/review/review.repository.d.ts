import { BaseRepository } from '../common/repositories/base.repository';
import { Review, ReviewStatus, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UpdateReviewDto } from './dto/submit-review.dto';
export declare class ReviewRepository extends BaseRepository<Review, Prisma.ReviewCreateInput, Prisma.ReviewUpdateInput> {
    private readonly prisma;
    constructor(prisma: DatabaseService);
    findByHospital(hospitalId: string): Promise<Review[]>;
    findByDoctor(doctorId: string): Promise<Review[]>;
    findFirstByAuthorAndEntity(authorId: string, hospitalId?: string, doctorId?: string): Promise<Review | null>;
    updateStatus(reviewId: string, status: ReviewStatus): Promise<Review>;
    updateContent(reviewId: string, updates: UpdateReviewDto): Promise<Review>;
    addAdminReply(reviewId: string, replyText: string): Promise<Review>;
    findPending(): Promise<Review[]>;
}
