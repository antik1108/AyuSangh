import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
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
    login(req: RequestWithUser, body: LoginDto): Promise<import("./types").LoginResponse>;
    refreshToken(body: RefreshTokenRequest): Promise<import("./types").RefreshTokenResponse>;
    logout(body: RefreshTokenRequest): Promise<{
        message: string;
    }>;
    registerUser(body: RegisterUserDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
    }>;
    registerHospital(body: RegisterHospitalDto): Promise<{
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
    getAdminData(): {
        sensitiveData: string;
    };
    googleAuth(): Promise<{
        message: string;
    }>;
}
export {};
