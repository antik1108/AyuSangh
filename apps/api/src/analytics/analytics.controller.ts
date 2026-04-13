import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  @Roles(Role.PLATFORM_ADMIN)
  getPlatformOverview() {
    return this.analyticsService.getPlatformOverview();
  }

  @Get('top-hospitals')
  @Roles(Role.PLATFORM_ADMIN)
  getTopRatedHospitals(@Query('limit') limit?: number) {
    return this.analyticsService.getTopRatedHospitals(limit ? +limit : 10);
  }

  @Get('review-trends')
  @Roles(Role.PLATFORM_ADMIN)
  getReviewTrends() {
    return this.analyticsService.getReviewTrends();
  }

  @Get('institution-types')
  @Roles(Role.PLATFORM_ADMIN)
  getInstitutionTypeBreakdown() {
    return this.analyticsService.getInstitutionTypeBreakdown();
  }

  @Get('hospital/:id')
  @Roles(Role.PLATFORM_ADMIN, Role.HOSPITAL_ADMIN)
  getHospitalStats(@Param('id') id: string) {
    return this.analyticsService.getHospitalStats(id);
  }
}
