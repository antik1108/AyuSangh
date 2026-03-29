import { DatabaseService } from '../database/database.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: DatabaseService);
    findOneByEmail(email: string): Promise<{
        refreshToken: string | null;
        id: string;
        email: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        refreshTokenExpiresAt: Date | null;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
    } | null>;
    findOneById(id: string): Promise<{
        refreshToken: string | null;
        id: string;
        email: string;
        profilePhoto: string | null;
        createdAt: Date;
        updatedAt: Date;
        passwordHash: string;
        refreshTokenExpiresAt: Date | null;
        role: import("@prisma/client").$Enums.Role;
        firstName: string | null;
        lastName: string | null;
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
