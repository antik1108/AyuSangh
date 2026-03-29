import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { Hospital } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HospitalRepository extends BaseRepository<Hospital> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.hospital);
  }

  async searchHospitals(nameQuery?: string, cityQuery?: string): Promise<Hospital[]> {
    return this.prisma.hospital.findMany({
      where: {
        ...(nameQuery && {
          OR: [
            { name: { contains: nameQuery, mode: 'insensitive' } },
            { description: { contains: nameQuery, mode: 'insensitive' } },
            { location: { city: { contains: nameQuery, mode: 'insensitive' } } },
            { location: { state: { contains: nameQuery, mode: 'insensitive' } } },
          ],
        }),
        ...(cityQuery && { location: { city: { contains: cityQuery, mode: 'insensitive' } } }),
      },
      include: {
        location: true,
        departments: true,
        accreditations: true,
      }
    });
  }
}
