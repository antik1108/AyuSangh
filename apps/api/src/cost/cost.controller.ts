import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CostService } from './cost.service';
import { CreateCostDto } from './dto/create-cost.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('hospitals/:id/costs')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Get()
  async getHospitalCosts(@Param('id') id: string) {
    return this.costService.getHospitalCosts(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN)
  async addCost(@Param('id') id: string, @Body() dto: CreateCostDto) {
    return this.costService.addCost(id, dto);
  }

  @Delete(':costId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOSPITAL_ADMIN)
  async deleteCost(@Param('id') hospitalId: string, @Param('costId') costId: string) {
    return this.costService.deleteCost(hospitalId, costId);
  }
}
