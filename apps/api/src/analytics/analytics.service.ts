import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: DatabaseService) {}

  /**
   * Platform-level overview stats for PLATFORM_ADMIN dashboard
   */
  async getPlatformOverview() {
    const [totalHospitals, totalDoctors, totalUsers, totalReviews, pendingReviews] =
      await Promise.all([
        this.prisma.hospital.count(),
        this.prisma.doctor.count(),
        this.prisma.user.count(),
        this.prisma.review.count(),
        this.prisma.review.count({ where: { status: 'PENDING' } }),
      ]);

    return { totalHospitals, totalDoctors, totalUsers, totalReviews, pendingReviews };
  }

  /**
   * Top-rated hospitals across the platform
   */
  async getTopRatedHospitals(limit = 10) {
    return this.prisma.hospital.findMany({
      where:   { rating: { not: null } },
      orderBy: { rating: 'desc' },
      take:    limit,
      select: {
        id:              true,
        name:            true,
        institutionType: true,
        rating:          true,
        location:        { select: { city: true, state: true } },
        _count:          { select: { reviews: true } },
      },
    });
  }

  /**
   * Review volume over time — grouped by month (last 6 months)
   */
  async getReviewTrends() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return this.prisma.review.groupBy({
      by:      ['status'],
      _count:  { id: true },
      where:   { createdAt: { gte: sixMonthsAgo } },
    });
  }

  /**
   * Per-hospital stats for HOSPITAL_ADMIN dashboard
   */
  async getHospitalStats(hospitalId: string) {
    const [totalReviews, approvedReviews, pendingReviews, favouriteCount, hospital] =
      await Promise.all([
        this.prisma.review.count({ where: { hospitalId } }),
        this.prisma.review.count({ where: { hospitalId, status: 'APPROVED' } }),
        this.prisma.review.count({ where: { hospitalId, status: 'PENDING' } }),
        this.prisma.favourite.count({ where: { hospitalId } }),
        this.prisma.hospital.findUnique({
          where:  { id: hospitalId },
          select: {
            rating:               true,
            ratingCleanliness:    true,
            ratingStaffBehaviour: true,
            ratingWaitTime:       true,
          },
        }),
      ]);

    return {
      hospitalId,
      totalReviews,
      approvedReviews,
      pendingReviews,
      favouriteCount,
      ratings: hospital,
    };
  }

  /**
   * Institution type distribution across the platform
   */
  async getInstitutionTypeBreakdown() {
    return this.prisma.hospital.groupBy({
      by:     ['institutionType'],
      _count: { id: true },
    });
  }
}
