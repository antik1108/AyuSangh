export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}
