import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { AuthenticatedUser, LoginResponse, RefreshTokenResponse } from './types';
export declare class AuthService {
    private usersService;
    private jwtService;
    private databaseService;
    private readonly accessTokenExpiry;
    private readonly refreshTokenExpiry;
    constructor(usersService: UsersService, jwtService: JwtService, databaseService: DatabaseService);
    validateUser(email: string, pass: string): Promise<AuthenticatedUser | null>;
    login(user: AuthenticatedUser): Promise<LoginResponse>;
    refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse>;
    logout(refreshToken: string): Promise<void>;
    validateRefreshToken(refreshToken: string): unknown;
    registerUser(data: RegisterUserDto): unknown;
    registerHospital(data: RegisterHospitalDto): unknown;
    registerDoctor(data: RegisterDoctorDto): unknown;
    private _generateRandomToken;
}
