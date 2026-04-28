import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly userRepository: UserRepository,
  ) {}

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  findOneById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createPatient(data: RegisterUserDto): Promise<User> {
    const existing = await this.findOneByEmail(data.email);

    if (existing) {
      throw new BadRequestException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.userRepository.create({
      email: data.email,
      passwordHash,
      name: data.name,
      role: UserRole.PATIENT,
    });
  }

  async createHospitalAdmin(data: RegisterHospitalDto): Promise<User> {
    const existing = await this.findOneByEmail(data.adminEmail);

    if (existing) {
      throw new BadRequestException('Admin email is already registered');
    }

    const passwordHash = await bcrypt.hash(data.adminPassword, 10);

    const [, adminUser] = await this.database.$transaction([
      this.database.institution.create({
        data: {
          name: data.hospitalName,
          type: data.hospitalType,
          description: data.description,
          city: data.city,
          pincode: data.pincode,
          address: data.address,
          phone: data.phone,
          bookingLink: data.bookingLink,
        },
      }),
      this.database.user.create({
        data: {
          email: data.adminEmail,
          passwordHash,
          name: data.adminName,
          role: UserRole.HOSPITAL_ADMIN,
        },
      }),
    ]);

    return adminUser;
  }
}
