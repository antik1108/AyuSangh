import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AccreditationService } from './accreditation.service';
import { CreateAccreditationDto, UpdateAccreditationDto } from './dto/accreditation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('accreditations')
export class AccreditationController {
  constructor(private readonly accreditationService: AccreditationService) {}

  @Get()
  getByHospital(
    @Query('hospitalId') hospitalId: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    if (activeOnly === 'true') {
      return this.accreditationService.getActive(hospitalId);
    }
    return this.accreditationService.getByHospital(hospitalId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.accreditationService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOSPITAL_ADMIN, Role.PLATFORM_ADMIN)
  create(@Body() dto: CreateAccreditationDto) {
    return this.accreditationService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOSPITAL_ADMIN, Role.PLATFORM_ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateAccreditationDto) {
    return this.accreditationService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.HOSPITAL_ADMIN, Role.PLATFORM_ADMIN)
  remove(@Param('id') id: string) {
    return this.accreditationService.remove(id);
  }
}
