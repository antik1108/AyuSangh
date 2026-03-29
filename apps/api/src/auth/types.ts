import { Role } from '@prisma/client';

/**
 * Authenticated user type with sensitive fields removed
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * JWT payload type
 */
export interface JwtPayload {
  email: string;
  sub: string; // user id
  role: Role;
  iat?: number;
  exp?: number;
}

/**
 * Login response type
 */
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  token_type: string;
  user: AuthenticatedUser;
}

/**
 * Refresh token response type
 */
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
  token_type: string;
}
