import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { SubmitReviewDto } from './dto/submit-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReplyReviewDto } from './dto/reply-review.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('hospitals/:id/reviews')
  async getHospitalReviews(@Param('id') id: string) {
    return this.reviewService.getHospitalReviews(id);
  }

  @Get('doctors/:id/reviews')
  async getDoctorReviews(@Param('id') id: string) {
    return this.reviewService.getDoctorReviews(id);
  }

  @Post('reviews')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  async submitReview(@Body() dto: SubmitReviewDto, @Req() req: AuthRequest) {
    return this.reviewService.submitReview(req.user.id, dto);
  }

  @Patch('reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  async editReview(@Param('id') id: string, @Body() dto: UpdateReviewDto, @Req() req: AuthRequest) {
    return this.reviewService.updateReview(id, req.user.id, dto);
  }

  @Delete('reviews/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT, UserRole.PLATFORM_ADMIN, UserRole.HOSPITAL_ADMIN)
  async deleteReview(@Param('id') id: string, @Req() req: AuthRequest) {
    const isAdmin = req.user.role === UserRole.PLATFORM_ADMIN || req.user.role === UserRole.HOSPITAL_ADMIN;
    return this.reviewService.deleteReview(id, req.user.id, isAdmin);
  }

  @Get('reviews/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async getPendingReviews() {
    return this.reviewService.getPendingReviews();
  }

  @Patch('reviews/:id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async approveReview(@Param('id') id: string) {
    return this.reviewService.approveReview(id);
  }

  @Patch('reviews/:id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  async rejectReview(@Param('id') id: string) {
    return this.reviewService.rejectReview(id);
  }

  @Patch('reviews/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN, UserRole.PLATFORM_ADMIN)
  async adminReply(@Param('id') id: string, @Body() dto: ReplyReviewDto, @Req() req: AuthRequest) {
    return this.reviewService.replyToReview(id, dto.text, req.user.id);
  }
}
