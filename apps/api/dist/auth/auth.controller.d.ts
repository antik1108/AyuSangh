import { Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from './types';
interface RequestWithUser extends Request {
    user: AuthenticatedUser;
}
interface RefreshTokenRequest {
    refresh_token: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: RequestWithUser, body: LoginDto): unknown;
    refreshToken(body: RefreshTokenRequest): unknown;
    logout(body: RefreshTokenRequest): unknown;
    registerUser(body: RegisterUserDto): unknown;
    signup(body: RegisterUserDto): unknown;
    registerHospital(body: RegisterHospitalDto): unknown;
    registerDoctor(body: RegisterDoctorDto): unknown;
    signupHospital(body: RegisterHospitalDto): unknown;
    signupDoctor(body: RegisterDoctorDto): unknown;
    getAdminData(): {
        sensitiveData: string;
    };
    googleAuth(): unknown;
}
export {};
