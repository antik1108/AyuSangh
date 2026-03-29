import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Get()
  searchHospitals(@Query('name') name?: string, @Query('city') city?: string) {
    return this.hospitalService.search(name, city);
  }

  @Get(':id')
  getHospital(@Param('id') id: string) {
    return this.hospitalService.getProfile(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.HOSPITAL_ADMIN)
  registerHospital(@Body() data: any) {
    return this.hospitalService.registerHospital(data);
  }
}
