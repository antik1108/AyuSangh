import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, body: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    registerUser(body: RegisterUserDto): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
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
