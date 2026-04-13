import { Role } from '@prisma/client';
export declare class LoginDto {
    email: string;
    role?: Role;
    password: string;
}
