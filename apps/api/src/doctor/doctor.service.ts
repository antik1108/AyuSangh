import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DoctorRepository } from './doctor.repository';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly doctorRepository: DoctorRepository) {}

  async searchDoctors(query?: string) {
    return this.doctorRepository.searchBySpecialization(query);
  }

  async getDoctorProfile(id: string) {
    const doctor = await this.doctorRepository.findWithInstitutions(id);
    if (!doctor) throw new NotFoundException('Doctor not found');
    return doctor;
  }

  async registerDoctor(userId: string, dto: RegisterDoctorDto) {
    return this.doctorRepository.create({
      userId: dto.userId || userId,
      name: dto.name,
      specialty: dto.specialty,
      experience: dto.experience,
      consultationFee: dto.consultationFee,
      qualifications: dto.qualifications,
      bio: dto.bio,
    });
  }

  async updateProfile(id: string, userId: string, dto: UpdateDoctorDto) {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new NotFoundException('Doctor not found');
    if (doctor.userId !== userId) throw new ConflictException('Unauthorized to update this profile');

    return this.doctorRepository.update(id, dto);
  }

  async linkToHospital(doctorId: string, hospitalId: string) {
    return this.doctorRepository.linkToHospital(doctorId, hospitalId);
  }

  async unlinkFromHospital(doctorId: string, hospitalId: string) {
    return this.doctorRepository.unlinkFromHospital(doctorId, hospitalId);
  }
}
