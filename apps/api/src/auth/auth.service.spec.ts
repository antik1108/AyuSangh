import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DatabaseService } from '../database/database.service';
import { AuthenticatedUser } from './types';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let databaseService: DatabaseService;

  const mockUser: AuthenticatedUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'PATIENT',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(),
            createPatient: jest.fn(),
            createHospitalAdmin: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            user: {
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should return user if email and password are valid', async () => {
      const mockBcrypt = jest.fn(() => Promise.resolve(true));
      jest.spyOn(require('bcrypt'), 'compare').mockImplementation(mockBcrypt);

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue({ ...mockUser, passwordHash: 'hashedPassword' });

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toEqual(mockUser);
      expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if user not found', async () => {
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const mockBcrypt = jest.fn(() => Promise.resolve(false));
      jest.spyOn(require('bcrypt'), 'compare').mockImplementation(mockBcrypt);

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockResolvedValue({ ...mockUser, passwordHash: 'hashedPassword' });

      const result = await service.validateUser('test@example.com', 'wrongPassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return login response with access and refresh tokens', async () => {
      const mockAccessToken = 'mockAccessToken';

      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);
      jest
        .spyOn(databaseService.refreshToken, 'create')
        .mockResolvedValue({
          token: 'refreshToken',
          userEmail: mockUser.email,
          expiresAt: new Date(),
          revokedAt: null,
        });
      jest.spyOn(databaseService.user, 'update').mockResolvedValue({});

      const result = await service.login(mockUser);

      expect(result.access_token).toBe(mockAccessToken);
      expect(result.expires_in).toBe('8h');
      expect(result.token_type).toBe('Bearer');
      expect(result.user).toEqual(mockUser);
      expect(result.refresh_token).toBeTruthy(); // Verify refresh token exists
      expect(jwtService.sign).toHaveBeenCalledWith(
        { email: mockUser.email, sub: mockUser.id, role: mockUser.role },
        { expiresIn: '8h' },
      );
      expect(databaseService.refreshToken.create).toHaveBeenCalled();
      expect(databaseService.user.update).toHaveBeenCalled();
    });

    it('should create refresh token with 7-day expiry', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');
      jest
        .spyOn(databaseService.refreshToken, 'create')
        .mockResolvedValue({
          token: 'refreshToken',
          userEmail: mockUser.email,
          expiresAt: new Date(),
          revokedAt: null,
        });
      jest.spyOn(databaseService.user, 'update').mockResolvedValue({});

      await service.login(mockUser);

      const createCall = jest.mocked(databaseService.refreshToken.create).mock.calls[0];
      const expiresAt = createCall[0].data.expiresAt as Date;
      const expectedExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

      expect(expiresAt.getTime()).toBeGreaterThanOrEqual(Date.now() + expectedExpiry - 1000); // 1s tolerance
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const mockAccessToken = 'newAccessToken';

      jest
        .spyOn(databaseService.refreshToken, 'findUnique')
        .mockResolvedValue({
          token: 'validRefreshToken',
          userEmail: mockUser.email,
          expiresAt: new Date(Date.now() + 1000000),
          revokedAt: null,
        });
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockAccessToken);

      const result = await service.refreshAccessToken('validRefreshToken');

      expect(result).toEqual({
        access_token: mockAccessToken,
        refresh_token: 'validRefreshToken',
        expires_in: '8h',
        token_type: 'Bearer',
      });
    });

    it('should throw UnauthorizedException if refresh token not found', async () => {
      jest.spyOn(databaseService.refreshToken, 'findUnique').mockResolvedValue(null);

      await expect(service.refreshAccessToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest
        .spyOn(databaseService.refreshToken, 'findUnique')
        .mockResolvedValue({
          token: 'refreshToken',
          userEmail: 'nonexistent@example.com',
          expiresAt: new Date(Date.now() + 1000000),
          revokedAt: null,
        });
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(null);

      await expect(service.refreshAccessToken('refreshToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if refresh token is expired', async () => {
      jest
        .spyOn(databaseService.refreshToken, 'findUnique')
        .mockResolvedValue({
          token: 'expiredToken',
          userEmail: mockUser.email,
          expiresAt: new Date(Date.now() - 1000),
          revokedAt: null,
        });

      await expect(service.refreshAccessToken('expiredToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should revoke refresh token', async () => {
      const mockRefreshToken = 'refreshToken';
      jest.spyOn(databaseService.refreshToken, 'update').mockResolvedValue({});

      await service.logout(mockRefreshToken);

      expect(databaseService.refreshToken.update).toHaveBeenCalledWith({
        where: { token: mockRefreshToken },
        data: { revokedAt: expect.any(Date) },
      });
    });
  });

  describe('registerUser', () => {
    it('should register a new patient user', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'password123',
      };

      jest.spyOn(usersService, 'createPatient').mockResolvedValue({
        id: '2',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: 'PATIENT',
      });

      const result = await service.registerUser(registerDto);

      expect(result).toEqual({
        id: '2',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: 'PATIENT',
      });
      expect(usersService.createPatient).toHaveBeenCalledWith(registerDto);
    });
  });
});
