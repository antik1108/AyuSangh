import { Injectable } from '@nestjs/common';
import { Review, Prisma, ReviewStatus } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewRepository extends BaseRepository<
  Review,
  Prisma.ReviewCreateInput | Prisma.ReviewUncheckedCreateInput,
  Prisma.ReviewUpdateInput | Prisma.ReviewUncheckedUpdateInput
> {
  constructor(db: DatabaseService) {
    super(db);
  }

  protected get model() {
    return this.db.review;
  }

  async findByHospital(hospitalId: string) {
    return this.model.findMany({
      where: {
        institutionId: hospitalId,
        status: ReviewStatus.APPROVED,
        isDeleted: false,
      },
      include: {
        user: { select: { id: true, name: true } },
        reviewReplies: true,
      },
    });
  }

  async findByDoctor(doctorId: string) {
    return this.model.findMany({
      where: {
        doctorId,
        status: ReviewStatus.APPROVED,
        isDeleted: false,
      },
      include: {
        user: { select: { id: true, name: true } },
        reviewReplies: true,
      },
    });
  }

  async findDuplicate(userId: string, hospitalId: string) {
    return this.model.findFirst({
      where: {
        userId,
        institutionId: hospitalId,
        isDeleted: false,
      },
    });
  }

  async findPending() {
    return this.model.findMany({
      where: {
        status: ReviewStatus.PENDING,
        isDeleted: false,
      },
      include: {
        user: { select: { id: true, name: true } },
        institution: { select: { id: true, name: true } },
      },
    });
  }

  async updateStatus(id: string, status: ReviewStatus) {
    return this.model.update({
      where: { id },
      data: { status },
    });
  }

  async addReply(reviewId: string, text: string, adminUserId: string) {
    return this.db.reviewReply.create({
      data: {
        reviewId,
        text,
        adminUserId,
      },
    });
  }
}
