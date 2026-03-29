import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { Review } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewRepository extends BaseRepository<Review> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.review);
  }

  async findByHospital(hospitalId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { hospitalId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByDoctor(doctorId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' }
    });
  }
}
