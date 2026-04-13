import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import { RefreshToken } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import {
  AuthenticatedUser,
  LoginResponse,
  RefreshTokenResponse,
} from './types';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiry = '8h';

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Login method that returns both access and refresh tokens
   */
  async login(user: AuthenticatedUser, expectedRole?: AuthenticatedUser['role']): Promise<LoginResponse> {
    if (expectedRole && user.role !== expectedRole) {
      throw new UnauthorizedException(
        `This account is registered as ${user.role}. Please select the matching role to continue.`,
      );
    }

    const payload = { email: user.email, sub: user.id, role: user.role };

    // Generate access token (short-lived)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiry,
    });

    // Generate refresh token (long-lived)
    const refreshToken = this._generateRandomToken();
    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ); // 7 days

    // Store refresh token in database
    await this.databaseService.refreshToken.create({
      data: {
        token: refreshToken,
        userEmail: user.email,
        expiresAt: refreshTokenExpiresAt,
      },
    });

    // Also update user's refresh token field for quick access
    await this.databaseService.user.update({
      where: { id: user.id },
      data: {
        refreshTokenExpiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: '8h',
      token_type: 'Bearer',
      user,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    // Validate refresh token exists and is not expired
    const tokenRecord = await this.databaseService.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token not found');
    }

    this._validateTokenRecord(tokenRecord);

    // Get user
    const user = await this.usersService.findOneByEmail(tokenRecord.userEmail);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new access token
    const payload = { email: user.email, sub: user.id, role: user.role };
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiry,
    });

    return {
      access_token: newAccessToken,
      refresh_token: refreshToken, // Return same refresh token
      expires_in: '8h',
      token_type: 'Bearer',
    };
  }

  /**
   * Logout - revoke refresh token
   */
  async logout(refreshToken: string): Promise<void> {
    await this.databaseService.refreshToken.update({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Validate refresh token is valid and not expired
   */
  async validateRefreshToken(refreshToken: string): Promise<RefreshToken> {
    const tokenRecord = await this.databaseService.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Refresh token not found');
    }

    this._validateTokenRecord(tokenRecord);
    return tokenRecord;
  }

  /**
   * Register a new patient user
   */
  async registerUser(data: RegisterUserDto) {
    return this.usersService.createPatient(data);
  }

  /**
   * Register a new hospital admin user
   */
  async registerHospital(data: RegisterHospitalDto) {
    return this.usersService.createHospitalAdmin(data);
  }

  /**
   * Generate a random token for refresh token
   */
  private _generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Validate refresh token record - extracted for reusability
   */
  private _validateTokenRecord(tokenRecord: RefreshToken): void {
    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    if (tokenRecord.revokedAt !== null) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }
  }
}
