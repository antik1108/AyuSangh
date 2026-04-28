import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { RegisterHospitalDto } from './dto/register-hospital.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthUser } from './interfaces/auth-user.interface';
import { RefreshTokenRepository } from './refresh-token.repository';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisteredUserView {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async registerPatient(dto: RegisterUserDto): Promise<RegisteredUserView> {
    const user = await this.usersService.createPatient(dto);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async registerHospital(dto: RegisterHospitalDto): Promise<RegisteredUserView> {
    const user = await this.usersService.createHospitalAdmin(dto);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }

  async login(user: AuthUser): Promise<AuthTokens> {
    const tokens = await this.generateTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Refresh session not found');
    }

    const refreshTokenRow = await this.refreshTokenRepository.findValidToken(user.id);

    if (!refreshTokenRow) {
      throw new UnauthorizedException('Refresh session not found');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, refreshTokenRow.tokenHash);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const tokens = await this.generateTokens(authUser);
    await this.refreshTokenRepository.revokeToken(refreshTokenRow.id);
    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    const tokens = await this.refreshTokenRepository.findUserTokens(userId);

    for (const token of tokens) {
      const matches = await bcrypt.compare(refreshToken, token.tokenHash);
      if (matches) {
        await this.refreshTokenRepository.revokeToken(token.id);
        return;
      }
    }
  }

  private async generateTokens(user: AuthUser): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
    const accessExpiresIn = '1h';
    const refreshExpiresIn = '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async persistRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.refreshTokenRepository.create({
      userId,
      tokenHash: refreshTokenHash,
      expiresAt: this.addDays(7),
    });
  }

  private addDays(days: number): Date {
    const next = new Date();
    next.setDate(next.getDate() + days);
    return next;
  }
}
