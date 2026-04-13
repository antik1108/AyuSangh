import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { Doctor, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DoctorRepository extends BaseRepository<
  Doctor,
  Prisma.DoctorCreateInput,
  Prisma.DoctorUpdateInput
> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.doctor);
  }

  async searchDoctors(query?: string): Promise<Doctor[]> {
    return this.prisma.doctor.findMany({
      where: {
        ...(query && {
          OR: [
            { specialization: { contains: query, mode: 'insensitive' } },
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { bio: { contains: query, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        institutions: { include: { hospital: { select: { id: true, name: true } } } },
        reviews: { where: { status: 'APPROVED' }, select: { ratingOverall: true } },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: {
        institutions: { include: { hospital: { select: { id: true, name: true, location: true } } } },
        reviews: {
          where: { status: 'APPROVED' },
          include: { author: { select: { firstName: true, lastName: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
