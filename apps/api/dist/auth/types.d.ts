import { Role } from '@prisma/client';
export interface AuthenticatedUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}
export interface JwtPayload {
    email: string;
    sub: string;
    role: Role;
    iat?: number;
    exp?: number;
}
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: string;
    token_type: string;
    user: AuthenticatedUser;
}
export interface RefreshTokenResponse {
    access_token: string;
    refresh_token: string;
    expires_in: string;
    token_type: string;
}
