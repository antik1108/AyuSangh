import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  async getAllPosts() {
    return this.communityService.getAllPosts();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT, UserRole.DOCTOR)
  async createPost(@Body() dto: CreatePostDto, @Req() req: AuthRequest) {
    return this.communityService.createPost(req.user.id, dto);
  }
}
