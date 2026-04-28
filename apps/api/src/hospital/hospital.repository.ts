import { Injectable } from '@nestjs/common';
import { Institution, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HospitalRepository extends BaseRepository<
  Institution,
  Prisma.InstitutionCreateInput,
  Prisma.InstitutionUpdateInput
> {
  constructor(db: DatabaseService) {
    super(db);
  }

  protected get model() {
    return this.db.institution;
  }

  async searchByFilters(name?: string, city?: string, type?: string): Promise<Institution[]> {
    const whereClause: Prisma.InstitutionWhereInput = {};
    if (name) {
      whereClause.name = { contains: name, mode: 'insensitive' };
    }
    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }
    if (type) {
      whereClause.type = { equals: type, mode: 'insensitive' };
    }

    return this.model.findMany({
      where: whereClause,
      orderBy: { averageRating: 'desc' },
    });
  }

  async findWithDetails(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        location: true,
        doctors: { include: { doctor: true } },
        reviews: true,
        photos: { orderBy: { displayOrder: 'asc' } },
        departments: true,
        accreditations: true,
      },
    });
  }

  async updateRatings(
    id: string,
    ratings: {
      averageRating: number;
      overallAvg: number;
      cleanlinessAvg: number;
      staffAvg: number;
      waitTimeAvg: number;
      totalReviews: number;
    },
  ) {
    return this.model.update({
      where: { id },
      data: {
        averageRating: ratings.averageRating,
        overallAvg: ratings.overallAvg,
        cleanlinessAvg: ratings.cleanlinessAvg,
        staffAvg: ratings.staffAvg,
        waitTimeAvg: ratings.waitTimeAvg,
        totalReviews: ratings.totalReviews,
      },
    });
  }
}
