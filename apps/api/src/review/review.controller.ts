import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { SubmitReviewDto, ReplyToReviewDto, ApproveReviewDto, RejectReviewDto } from './dto/submit-review.dto';

interface RequestWithUser extends Request {
  user: { userId: string; email: string; role: string };
}

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

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN)
  getPendingReviews() {
    return this.reviewService.getPendingReviews();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  submitReview(@Request() req: RequestWithUser, @Body() data: SubmitReviewDto) {
    return this.reviewService.submitReview(req.user.userId, data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PATIENT)
  updateReview(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updates: { rating?: number; text?: string },
  ) {
    return this.reviewService.updateReview(id, req.user.userId, updates);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteReview(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.reviewService.deleteReview(id, req.user.userId, req.user.role);
  }

  // Admin endpoints for moderation
  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN)
  approveReview(@Param('id') id: string) {
    return this.reviewService.approveReview(id);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN)
  rejectReview(@Param('id') id: string) {
    return this.reviewService.rejectReview(id);
  }

  @Post(':id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOSPITAL_ADMIN, Role.PLATFORM_ADMIN)
  replyToReview(@Param('id') id: string, @Body() body: ReplyToReviewDto) {
    return this.reviewService.replyToReview(id, body.replyText);
  }
}
