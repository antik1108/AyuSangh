import { Injectable } from '@nestjs/common';
import { DoctorRepository } from './doctor.repository';

@Injectable()
export class DoctorService {
  constructor(private readonly doctorRepo: DoctorRepository) {}

  async search(specialization?: string) {
    return this.doctorRepo.searchDoctors(specialization);
  }

  async getProfile(id: string) {
    return this.doctorRepo.findById(id);
  }

  async registerDoctor(data: any) {
    return this.doctorRepo.create({
      firstName: data.firstName,
      lastName: data.lastName,
      specialization: data.specialization,
      experienceYears: data.experienceYears,
      bio: data.bio,
      user: { connect: { id: data.userId } }
    });
  }
}
