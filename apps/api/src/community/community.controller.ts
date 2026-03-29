import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CommunityService } from './community.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  getPosts() {
    return this.communityService.getAllPosts();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Request() req: any, @Body() data: any) {
    return this.communityService.createPost({
      ...data,
      authorId: req.user.userId,
    });
  }
}
