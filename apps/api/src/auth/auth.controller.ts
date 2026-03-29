import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from './guards/roles.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: any, @Body() body: LoginDto) { // Added @Body for Swagger/docs context even though LocalStrategy handles it
    return this.authService.login(req.user);
  }

  @Post('register/user')
  async registerUser(@Body() body: RegisterUserDto) {
    return this.authService.registerUser(body);
  }

  @Post('register/hospital')
  async registerHospital(@Body() body: RegisterHospitalDto) {
    return this.authService.registerHospital(body);
  }

  // Example of a protected route using RBAC
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PLATFORM_ADMIN, Role.HOSPITAL_ADMIN)
  @Get('admin-only')
  getAdminData() {
    return { sensitiveData: 'This is protected by RBAC.' };
  }

  @Get('google')
  async googleAuth() {
    // Stub for Google OAuth strategy
    return { message: 'Redirecting to Google OAuth (To Be Implemented with ClientIDs)' };
  }
}
