import { Injectable } from '@nestjs/common';
import { HospitalRepository } from './hospital.repository';

@Injectable()
export class HospitalService {
  constructor(private readonly hospitalRepo: HospitalRepository) {}

  async search(name?: string, city?: string) {
    return this.hospitalRepo.searchHospitals(name, city);
  }

  getRepo() {
    return this.hospitalRepo;
  }

  async getProfile(id: string) {
    return this.hospitalRepo.findById(id);
  }

  async registerHospital(data: any) {
    return this.hospitalRepo.create({
      name: data.name,
      description: data.description,
      admin: { connect: { id: data.adminId } },
      location: {
        create: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        }
      }
    });
  }
}
