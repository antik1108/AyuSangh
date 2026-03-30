import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from './hospital.repository';

interface UploadResult {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

@Injectable()
export class HospitalService {
  constructor(private readonly hospitalRepo: HospitalRepository) {}

  async search(name?: string, city?: string) {
    return this.hospitalRepo.searchHospitals(name, city);
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
          country: data.country,
        },
      },
    });
  }

  async updateProfilePhoto(hospitalId: string, photoUrl: string) {
    const hospital = await this.hospitalRepo.findById(hospitalId);
    if (!hospital) throw new NotFoundException('Hospital not found');
    return this.hospitalRepo.updateProfilePhoto(hospitalId, photoUrl);
  }

  async addImages(hospitalId: string, uploadResults: UploadResult[]) {
    const hospital = await this.hospitalRepo.findById(hospitalId);
    if (!hospital) throw new NotFoundException('Hospital not found');

    return this.hospitalRepo.addImages(
      hospitalId,
      uploadResults.map((r) => ({ imageUrl: r.url, isProfilePhoto: false })),
    );
  }

  async deleteImage(hospitalId: string, imageId: string) {
    const image = await this.hospitalRepo.findImage(imageId);
    if (!image || image.hospitalId !== hospitalId) {
      throw new NotFoundException('Image not found or does not belong to this hospital');
    }
    return this.hospitalRepo.deleteImage(imageId);
  }
}
