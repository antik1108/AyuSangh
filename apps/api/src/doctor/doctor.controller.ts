import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  searchDoctors(@Query('specialization') specialization?: string) {
    return this.doctorService.search(specialization);
  }

  @Get(':id')
  getDoctor(@Param('id') id: string) {
    return this.doctorService.getProfile(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.HOSPITAL_ADMIN, Role.DOCTOR)
  registerDoctor(@Body() data: any) {
    return this.doctorService.registerDoctor(data);
  }
}
