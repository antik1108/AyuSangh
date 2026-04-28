import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../hospital/hospital.repository';
import { DoctorRepository } from '../doctor/doctor.repository';
import { SearchDto } from './dto/search.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdvancedSearchService {
  constructor(
    private readonly hospitalRepository: HospitalRepository,
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async advancedHospitalSearch(options: SearchDto) {
    // We must bypass protected model to use raw query or we can cast
    const model = (this.hospitalRepository as unknown as { model: Record<string, Function> }).model;
    const where: Prisma.InstitutionWhereInput = {};
    
    if (options.city) {
      where.city = { equals: options.city, mode: 'insensitive' };
    }
    if (options.type) {
      where.type = options.type;
    }
    if (options.minRating) {
      where.averageRating = { gte: options.minRating };
    }
    if (options.q) {
      where.name = { contains: options.q, mode: 'insensitive' };
    }

    return model.findMany({
      where,
      take: options.limit,
      skip: options.offset,
      include: { location: true },
    });
  }

  async findNearby(lat: number, lng: number, limit: number) {
    const model = (this.hospitalRepository as unknown as { model: Record<string, Function> }).model;
    const hospitals = await model.findMany({
      include: { location: true },
    });
    
    return hospitals
      .filter((h: Prisma.InstitutionGetPayload<{ include: { location: true } }>) => h.location)
      .map((h: Prisma.InstitutionGetPayload<{ include: { location: true } }>) => {
        const dLat = Number(h.location!.latitude) - lat;
        const dLng = Number(h.location!.longitude) - lng;
        const distSq = dLat * dLat + dLng * dLng;
        return { ...h, distanceSq: distSq };
      })
      .sort((a: { distanceSq: number }, b: { distanceSq: number }) => a.distanceSq - b.distanceSq)
      .slice(0, limit)
      .map(({ distanceSq, ...rest }: { distanceSq: number; [key: string]: unknown }) => rest);
  }

  async getTrendingSearches() {
    const model = (this.hospitalRepository as unknown as { model: Record<string, Function> }).model;
    const results = await model.groupBy({
      by: ['city'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 5,
    });
    return results.map((r: { city: string }) => r.city);
  }

  async advancedDoctorSearch(options: SearchDto) {
    const model = (this.doctorRepository as unknown as { model: Record<string, Function> }).model;
    const where: Prisma.DoctorWhereInput = {};
    
    if (options.q) {
      where.name = { contains: options.q, mode: 'insensitive' };
    }

    return model.findMany({
      where,
      take: options.limit,
      skip: options.offset,
      include: { user: { select: { name: true } } },
    });
  }
}
