import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { Review, ReviewStatus, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { UpdateReviewDto } from './dto/submit-review.dto';

@Injectable()
export class ReviewRepository extends BaseRepository<
  Review,
  Prisma.ReviewCreateInput,
  Prisma.ReviewUpdateInput
> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.review);
  }

  async findByHospital(hospitalId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { hospitalId },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDoctor(doctorId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { doctorId },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFirstByAuthorAndEntity(
    authorId: string,
    hospitalId?: string,
    doctorId?: string,
  ): Promise<Review | null> {
    return this.prisma.review.findFirst({
      where: {
        authorId,
        hospitalId: hospitalId ?? undefined,
        doctorId: doctorId ?? undefined,
      },
    });
  }

  async updateStatus(reviewId: string, status: ReviewStatus): Promise<Review> {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });
  }

  async updateContent(reviewId: string, updates: UpdateReviewDto): Promise<Review> {
    return this.prisma.review.update({
      where: { id: reviewId },
      // Re-submit for moderation whenever content changes
      data: { ...updates, status: ReviewStatus.PENDING },
    });
  }

  async addAdminReply(reviewId: string, replyText: string): Promise<Review> {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { adminReply: replyText, adminReplyAt: new Date() },
    });
  }

  async findPending(): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { status: ReviewStatus.PENDING },
      include: {
        author:   { select: { id: true, email: true, firstName: true, lastName: true } },
        hospital: { select: { id: true, name: true } },
        doctor:   { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
