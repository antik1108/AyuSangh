import { Injectable } from '@nestjs/common';
import { DoctorRepository } from './doctor.repository';
import { RegisterDoctorDto } from './dto/register-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly doctorRepo: DoctorRepository) {}

  async search(specialization?: string) {
    return this.doctorRepo.searchDoctors(specialization);
  }

  async getProfile(id: string) {
    return this.doctorRepo.findById(id);
  }

  async registerDoctor(dto: RegisterDoctorDto) {
    return this.doctorRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      specialization: dto.specialization,
      experienceYears: dto.experienceYears,
      bio: dto.bio,
      phone: dto.phone,
      qualifications: dto.qualifications ?? [],
      consultationFee: dto.consultationFee,
      ...(dto.userId && { user: { connect: { id: dto.userId } } }),
    });
  }
}
