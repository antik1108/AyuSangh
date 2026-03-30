import { DatabaseService } from '../database/database.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: DatabaseService);
    findOneByEmail(email: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        refreshToken: string | null;
        refreshTokenExpiresAt: Date | null;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findOneById(id: string): Promise<{
        id: string;
        email: string;
        passwordHash: string;
        refreshToken: string | null;
        refreshTokenExpiresAt: Date | null;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createPatient(data: RegisterUserDto): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
    }>;
    createHospitalAdmin(data: RegisterHospitalDto): Promise<{
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
}
