import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DatabaseService } from '../database/database.service';

describe('UsersService', () => {
  let service: UsersService;
  let databaseService: DatabaseService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    passwordHash: 'hashedPassword',
    role: 'PATIENT',
    refreshTokenExpiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            location: {
              create: jest.fn(),
            },
            hospital: {
              create: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneByEmail', () => {
    it('should return user when found by email', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findOneByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should return user when found by id', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(mockUser);

      const result = await service.findOneById('1');

      expect(result).toEqual(mockUser);
      expect(databaseService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(databaseService.user, 'findUnique').mockResolvedValue(null);

      const result = await service.findOneById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('createPatient', () => {
    it('should create a new patient user with hashed password', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'password123',
      };

      const expectedResult = {
        id: '2',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: 'PATIENT',
      };

      jest.spyOn(databaseService.user, 'create').mockResolvedValue(expectedResult);

      const result = await service.createPatient(registerDto);

      expect(result).toEqual(expectedResult);
      expect(databaseService.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            email: registerDto.email,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            passwordHash: expect.any(String),
            role: 'PATIENT',
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        }),
      );
    });

    it('should hash password with bcrypt', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'password123',
      };

      jest
        .spyOn(databaseService.user, 'create')
        .mockImplementation(async (data: any) => {
          // Verify passwordHash is different from original password
          expect(data.data.passwordHash).not.toBe(registerDto.password);
          return {
            id: '2',
            email: registerDto.email,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: 'PATIENT',
          };
        });

      await service.createPatient(registerDto);

      expect(databaseService.user.create).toHaveBeenCalled();
    });

    it('should exclude passwordHash from response', async () => {
      const registerDto = {
        email: 'newuser@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: 'password123',
      };

      jest.spyOn(databaseService.user, 'create').mockResolvedValue({
        id: '2',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: 'PATIENT',
      });

      const result = await service.createPatient(registerDto);

      expect(result).not.toHaveProperty('passwordHash');
    });
  });

  describe('createHospitalAdmin', () => {
    it('should create hospital admin, location, and hospital in a transaction', async () => {
      const registerDto = {
        name: 'City Hospital',
        description: 'A leading hospital in the city',
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

      const mockTransaction = jest.fn(async (callback) => {
        const txMock = {
          user: {
            create: jest
              .fn()
              .mockResolvedValue({
                id: 'admin-1',
                email: registerDto.admin.email,
                firstName: registerDto.admin.firstName,
                lastName: registerDto.admin.lastName,
                role: 'HOSPITAL_ADMIN',
              }),
          },
          location: {
            create: jest
              .fn()
              .mockResolvedValue({
                id: 'location-1',
                ...registerDto.location,
              }),
          },
          hospital: {
            create: jest
              .fn()
              .mockResolvedValue({
                id: 'hospital-1',
                name: registerDto.name,
                description: registerDto.description,
                adminId: 'admin-1',
                locationId: 'location-1',
              }),
          },
        };
        return callback(txMock);
      });

      jest
        .spyOn(databaseService, '$transaction')
        .mockImplementation(mockTransaction);

      const result = await service.createHospitalAdmin(registerDto);

      expect(result).toEqual({
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
      });
      expect(databaseService.$transaction).toHaveBeenCalled();
    });

    it('should use transaction for atomicity', async () => {
      const registerDto = {
        name: 'City Hospital',
        description: 'A leading hospital in the city',
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

      const mockCallback = jest.fn();
      jest.spyOn(databaseService, '$transaction').mockImplementation(async (cb) => {
        mockCallback(cb);
        return cb({
          user: { create: jest.fn().mockResolvedValue({ id: '1' }) },
          location: { create: jest.fn().mockResolvedValue({ id: '1' }) },
          hospital: { create: jest.fn().mockResolvedValue({ id: '1' }) },
        });
      });

      await service.createHospitalAdmin(registerDto);

      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
