import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { Hospital, InstitutionImage, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class HospitalRepository extends BaseRepository<
  Hospital,
  Prisma.HospitalCreateInput,
  Prisma.HospitalUpdateInput
> {
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
      },
    });
  }

  async updateProfilePhoto(hospitalId: string, photoUrl: string): Promise<Hospital> {
    return this.prisma.hospital.update({
      where: { id: hospitalId },
      data: { profilePhoto: photoUrl },
    });
  }

  async addImages(
    hospitalId: string,
    images: Array<{ imageUrl: string; isProfilePhoto: boolean }>,
  ): Promise<InstitutionImage[]> {
    return Promise.all(
      images.map((image) =>
        this.prisma.institutionImage.create({
          data: { ...image, hospitalId },
        }),
      ),
    );
  }

  async updateInstitution(
    hospitalId: string,
    data: Prisma.HospitalUpdateInput,
  ): Promise<Hospital> {
    return this.prisma.hospital.update({
      where: { id: hospitalId },
      data,
      include: { location: true },
    });
  }

  /**
   * updateInstitutionRating — called after review approve/reject
   *
   * Persists the recalculated aggregate rating scores back to the Hospital row.
   * Matches the Submit Review sequence diagram step:
   *   "Service -> Repo: updateInstitutionRating(institutionId, newAvg)"
   */
  async updateInstitutionRating(
    hospitalId: string,
    scores: {
      rating: number;
      ratingCleanliness: number;
      ratingStaffBehaviour: number;
      ratingWaitTime: number;
    },
  ): Promise<Hospital> {
    return this.prisma.hospital.update({
      where: { id: hospitalId },
      data:  scores,
    });
  }

  /**
   * findApprovedReviews — used by HospitalService.recalculateAndPersistRating
   */
  async findApprovedReviews(hospitalId: string) {
    return this.prisma.review.findMany({
      where: { hospitalId, status: 'APPROVED' },
      select: {
        ratingOverall:        true,
        ratingCleanliness:    true,
        ratingStaffBehaviour: true,
        ratingWaitTime:       true,
      },
    });
  }

  async findImage(imageId: string): Promise<InstitutionImage | null> {
    return this.prisma.institutionImage.findUnique({ where: { id: imageId } });
  }

  async deleteImage(imageId: string): Promise<InstitutionImage> {
    return this.prisma.institutionImage.delete({ where: { id: imageId } });
  }
}
