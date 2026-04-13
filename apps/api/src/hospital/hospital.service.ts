import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { HospitalRepository } from './hospital.repository';
import { UpdateHospitalDto } from './dto/update-hospital.dto';

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

  /**
   * updateInstitution — PATCH /hospitals/:id
   *
   * Implements the sequence diagram flow:
   *   1. Find institution by id
   *   2. Verify the requesting user owns this institution (or is PLATFORM_ADMIN)
   *   3. Apply partial update
   */
  async updateInstitution(
    userId: string,
    userRole: string,
    institutionId: string,
    dto: UpdateHospitalDto,
  ) {
    const hospital = await this.hospitalRepo.findById(institutionId);
    if (!hospital) throw new NotFoundException('Hospital not found');

    // Ownership check — PLATFORM_ADMIN bypasses this
    if (userRole !== 'PLATFORM_ADMIN' && hospital.adminId !== userId) {
      throw new ForbiddenException('You do not own this institution');
    }

    return this.hospitalRepo.updateInstitution(institutionId, dto);
  }

  /**
   * recalculateAndPersistRating — called by ReviewService after approve/reject
   *
   * Fetches all approved reviews for the hospital, runs them through the
   * DefaultRatingStrategy arithmetic mean, and persists the result.
   * Matches the Submit Review sequence diagram step:
   *   "Service -> Repo: updateInstitutionRating(institutionId, newAvg)"
   */
  async recalculateAndPersistRating(hospitalId: string): Promise<void> {
    const hospital = await this.hospitalRepo.findById(hospitalId);
    if (!hospital) return;

    // Fetch all approved reviews directly via repository
    const reviews = await this.hospitalRepo.findApprovedReviews(hospitalId);
    if (reviews.length === 0) return;

    const count = reviews.length;
    const round = (n: number) => Math.round((n / count) * 10) / 10;

    const totals = reviews.reduce(
      (acc, r) => ({
        overall:        acc.overall        + r.ratingOverall,
        cleanliness:    acc.cleanliness    + r.ratingCleanliness,
        staffBehaviour: acc.staffBehaviour + r.ratingStaffBehaviour,
        waitTime:       acc.waitTime       + r.ratingWaitTime,
      }),
      { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0 },
    );

    await this.hospitalRepo.updateInstitutionRating(hospitalId, {
      rating:               round(totals.overall),
      ratingCleanliness:    round(totals.cleanliness),
      ratingStaffBehaviour: round(totals.staffBehaviour),
      ratingWaitTime:       round(totals.waitTime),
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
