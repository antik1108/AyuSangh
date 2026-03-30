import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DatabaseService } from './../src/database/database.service';

describe('Auth Integration', () => {
  let app: INestApplication<App>;

  const databaseMock = {
    user: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    location: {
      create: jest.fn(),
    },
    hospital: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeAll(async () => {
    databaseMock.$transaction.mockImplementation(async (callback: any) => {
      const tx = {
        user: {
          create: jest.fn().mockResolvedValue({
            id: 'admin-1',
            email: 'admin@hospital.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'HOSPITAL_ADMIN',
          }),
        },
        location: {
          create: jest.fn().mockResolvedValue({ id: 'loc-1' }),
        },
        hospital: {
          create: jest.fn().mockResolvedValue({
            id: 'hosp-1',
            name: 'City Hospital',
          }),
        },
      };
      return callback(tx);
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DatabaseService)
      .useValue(databaseMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register/user should create patient user', async () => {
    databaseMock.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'newuser@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'PATIENT',
    });

    const payload = {
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register/user')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      id: 'user-1',
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: 'PATIENT',
    });
    expect(databaseMock.user.create).toHaveBeenCalledTimes(1);
  });

  it('POST /auth/register/hospital should create hospital and admin in transaction', async () => {
    const payload = {
      name: 'City Hospital',
      description: 'A leading hospital',
      admin: {
        email: 'admin@hospital.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
      },
      location: {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register/hospital')
      .send(payload)
      .expect(201);

    expect(response.body).toEqual({
      user: {
        id: 'admin-1',
        email: 'admin@hospital.com',
        role: 'HOSPITAL_ADMIN',
        firstName: 'Admin',
        lastName: 'User',
      },
      hospital: {
        id: 'hosp-1',
        name: 'City Hospital',
      },
    });
    expect(databaseMock.$transaction).toHaveBeenCalledTimes(1);
  });

  it('POST /auth/refresh should return 400 when refresh_token is missing', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({})
      .expect(400)
      .expect(({ body }) => {
        expect(body.message).toBe('refresh_token is required');
      });
  });

  it('POST /auth/register/user should return 400 for invalid payload', async () => {
    const badPayload = {
      email: 'invalid-email',
      password: '123',
      firstName: '',
      lastName: '',
    };

    await request(app.getHttpServer())
      .post('/auth/register/user')
      .send(badPayload)
      .expect(400)
      .expect(({ body }) => {
        expect(Array.isArray(body.message)).toBe(true);
      });
  });
});
