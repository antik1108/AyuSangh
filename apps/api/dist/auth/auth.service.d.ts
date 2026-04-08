import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RefreshToken } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import { AuthenticatedUser, LoginResponse, RefreshTokenResponse } from './types';
export declare class AuthService {
    private usersService;
    private jwtService;
    private databaseService;
    private readonly accessTokenExpiry;
    constructor(usersService: UsersService, jwtService: JwtService, databaseService: DatabaseService);
    validateUser(email: string, pass: string): Promise<AuthenticatedUser | null>;
    login(user: AuthenticatedUser): Promise<LoginResponse>;
    refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse>;
    logout(refreshToken: string): Promise<void>;
    validateRefreshToken(refreshToken: string): Promise<RefreshToken>;
    registerUser(data: RegisterUserDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
    }>;
    registerHospital(data: RegisterHospitalDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            firstName: string | null;
            lastName: string | null;
        };
        hospital: {
            id: string;
            name: string;
        };
    }>;
    private _generateRandomToken;
    private _validateTokenRecord;
}
