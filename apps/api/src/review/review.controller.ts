import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('hospital/:id')
  getHospitalReviews(@Param('id') id: string) {
    return this.reviewService.getHospitalReviews(id);
  }

  @Get('doctor/:id')
  getDoctorReviews(@Param('id') id: string) {
    return this.reviewService.getDoctorReviews(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  submitReview(@Request() req: any, @Body() data: any) {
    return this.reviewService.submitReview({
      ...data,
      authorId: req.user.userId,
    });
  }
}
