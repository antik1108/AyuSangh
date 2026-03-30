import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './types';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser: AuthenticatedUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'PATIENT',
  };

  const mockLoginResponse = {
    access_token: 'mockAccessToken',
    refresh_token: 'mockRefreshToken',
    expires_in: '8h',
    token_type: 'Bearer',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            refreshAccessToken: jest.fn(),
            logout: jest.fn(),
            registerUser: jest.fn(),
            registerHospital: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should call authService.login with user from request', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockLoginResponse);

      const mockRequest = {
        user: mockUser,
      };

      const result = await controller.login(mockRequest as any, {});

      expect(result).toEqual(mockLoginResponse);
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const mockRefreshResponse = {
        access_token: 'newAccessToken',
        refresh_token: 'refreshToken',
        expires_in: '8h',
        token_type: 'Bearer',
      };

      jest.spyOn(authService, 'refreshAccessToken').mockResolvedValue(mockRefreshResponse);

      const result = await controller.refreshToken({
        refresh_token: 'refreshToken',
      });

      expect(result).toEqual(mockRefreshResponse);
      expect(authService.refreshAccessToken).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('logout', () => {
    it('should logout and revoke refresh token', async () => {
      jest.spyOn(authService, 'logout').mockResolvedValue(undefined);

      const result = await controller.logout({
        refresh_token: 'refreshToken',
      });

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(authService.logout).toHaveBeenCalledWith('refreshToken');
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

      const expectedResponse = {
        id: '2',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: 'PATIENT',
      };

      jest.spyOn(authService, 'registerUser').mockResolvedValue(expectedResponse);

      const result = await controller.registerUser(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.registerUser).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('registerHospital', () => {
    it('should register a new hospital with admin', async () => {
      const registerDto = {
        name: 'City Hospital',
        description: 'A leading hospital',
        admin: {
          email: 'admin@hospital.com',
          firstName: 'Admin',
          lastName: 'User',
          password: 'password123',
        },
        location: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA',
        },
      };

      const expectedResponse = {
        user: {
          id: 'admin-1',
          email: registerDto.admin.email,
          role: 'HOSPITAL_ADMIN',
          firstName: registerDto.admin.firstName,
          lastName: registerDto.admin.lastName,
        },
        hospital: {
          id: 'hospital-1',
          name: registerDto.name,
        },
      };

      jest.spyOn(authService, 'registerHospital').mockResolvedValue(expectedResponse);

      const result = await controller.registerHospital(registerDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.registerHospital).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getAdminData', () => {
    it('should return admin data for authorized users', () => {
      const result = controller.getAdminData();

      expect(result).toEqual({
        sensitiveData: 'This is protected by RBAC.',
      });
    });
  });

  describe('googleAuth', () => {
    it('should return message about Google OAuth implementation', async () => {
      const result = await controller.googleAuth();

      expect(result).toEqual({
        message: 'Redirecting to Google OAuth (To Be Implemented with ClientIDs)',
      });
    });
  });
});
