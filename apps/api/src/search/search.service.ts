import { Injectable } from '@nestjs/common';
import { HospitalRepository } from '../hospital/hospital.repository';
import { DoctorRepository } from '../doctor/doctor.repository';

@Injectable()
export class SearchService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  constructor(
    private readonly hospitalRepository: HospitalRepository,
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async globalSearch(query: string) {
    const cacheKey = `globalSearch:${query?.toLowerCase() || ''}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.TTL) {
      return cached.data;
    }

    const hospitalModel = (this.hospitalRepository as unknown as { model: Record<string, Function> }).model;
    const doctorModel = (this.doctorRepository as unknown as { model: Record<string, Function> }).model;

    const [hospitals, doctors] = await Promise.all([
      hospitalModel.findMany({
        where: { name: { contains: query || '', mode: 'insensitive' } },
        take: 10,
      }),
      doctorModel.findMany({
        where: { name: { contains: query || '', mode: 'insensitive' } },
        take: 10,
      }),
    ]);

    const result = { hospitals, doctors };

    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  }
}
