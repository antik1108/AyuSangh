import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { Accreditation, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AccreditationRepository extends BaseRepository<
  Accreditation,
  Prisma.AccreditationCreateInput,
  Prisma.AccreditationUpdateInput
> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.accreditation);
  }

  async findByHospital(hospitalId: string): Promise<Accreditation[]> {
    return this.prisma.accreditation.findMany({
      where: { hospitalId },
      orderBy: { issueDate: 'desc' },
    });
  }

  async findActive(hospitalId: string): Promise<Accreditation[]> {
    return this.prisma.accreditation.findMany({
      where: {
        hospitalId,
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } },
        ],
      },
      orderBy: { issueDate: 'desc' },
    });
  }
}
