import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from './decorators/roles.decorator';
import { AuthService } from './auth.service';
import { AuthTokens, RegisteredUserView } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthRequest } from './interfaces/auth-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/patient')
  registerPatient(@Body() dto: RegisterUserDto): Promise<RegisteredUserView> {
    return this.authService.registerPatient(dto);
  }

  @Post('register/hospital')
  registerHospital(@Body() dto: RegisterHospitalDto): Promise<RegisteredUserView> {
    return this.authService.registerHospital(dto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: AuthRequest, @Body() _dto: LoginDto): Promise<AuthTokens> {
    return this.authService.login(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() dto: RefreshDto): Promise<AuthTokens> {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Req() req: AuthRequest, @Body() dto: RefreshDto) {
    await this.authService.logout(req.user.id, dto.refreshToken);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PLATFORM_ADMIN)
  @Post('admin/ping')
  adminPing() {
    return { message: 'admin access granted' };
  }
}
