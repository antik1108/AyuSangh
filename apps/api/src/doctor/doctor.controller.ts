import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { AuthRequest } from '../auth/interfaces/auth-request.interface';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async searchDoctors(@Query('specialization') specialization?: string) {
    return this.doctorService.searchDoctors(specialization);
  }

  @Get(':id')
  async getDoctorProfile(@Param('id') id: string) {
    return this.doctorService.getDoctorProfile(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.PLATFORM_ADMIN)
  async registerDoctor(@Body() dto: RegisterDoctorDto, @Req() req: AuthRequest) {
    return this.doctorService.registerDoctor(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateDoctorDto, @Req() req: AuthRequest) {
    return this.doctorService.updateProfile(id, req.user.id, dto);
  }

  @Post(':id/institutions/:hospitalId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN, UserRole.PLATFORM_ADMIN)
  async linkToHospital(@Param('id') doctorId: string, @Param('hospitalId') hospitalId: string) {
    return this.doctorService.linkToHospital(doctorId, hospitalId);
  }

  @Delete(':id/institutions/:hospitalId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN, UserRole.PLATFORM_ADMIN)
  async unlinkFromHospital(@Param('id') doctorId: string, @Param('hospitalId') hospitalId: string) {
    return this.doctorService.unlinkFromHospital(doctorId, hospitalId);
  }
}
