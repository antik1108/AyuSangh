import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from './hospital.repository';
import { DatabaseService } from '../database/database.service';

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
  constructor(
    private readonly hospitalRepo: HospitalRepository,
    private readonly prisma: DatabaseService,
  ) {}

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

  async updateProfilePhoto(hospitalId: string, photoUrl: string) {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    return this.prisma.hospital.update({
      where: { id: hospitalId },
      data: { profilePhoto: photoUrl },
    });
  }

  async addImages(hospitalId: string, uploadResults: UploadResult[]) {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    // Save images to database
    const images = uploadResults.map((result) => ({
      imageUrl: result.url,
      hospitalId: hospitalId,
      isProfilePhoto: false,
    }));

    // Create institution images in database
    const createdImages = await Promise.all(
      images.map((image) =>
        this.prisma.institutionImage.create({
          data: image,
        }),
      ),
    );

    return createdImages;
  }

  async deleteImage(hospitalId: string, imageId: string) {
    const image = await this.prisma.institutionImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.hospitalId !== hospitalId) {
      throw new NotFoundException('Image not found or does not belong to this hospital');
    }

    // Delete from Cloudinary if public ID exists
    // (integration with CloudinaryService.deleteImage can be added)

    return this.prisma.institutionImage.delete({
      where: { id: imageId },
    });
  }
}
