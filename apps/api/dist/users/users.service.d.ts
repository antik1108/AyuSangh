import { DatabaseService } from '../database/database.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: DatabaseService);
    findOneByEmail(email: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string | null;
        lastName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        passwordHash: string;
    } | null>;
    findOneById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        firstName: string | null;
        lastName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        passwordHash: string;
    } | null>;
    createPatient(data: RegisterUserDto): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        role: import("@prisma/client").$Enums.Role;
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
