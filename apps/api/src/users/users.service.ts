import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RegisterHospitalDto } from '../auth/dto/register-hospital.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private prisma: DatabaseService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findOneById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async createPatient(data: RegisterUserDto) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);
    
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'PATIENT',
      },
      select: { id: true, email: true, firstName: true, lastName: true, role: true } // Exclude passwordHash
    });
  }

  async createHospitalAdmin(data: RegisterHospitalDto) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.admin.password, salt);

    // Using interactive transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: data.admin.email,
          passwordHash,
          firstName: data.admin.firstName,
          lastName: data.admin.lastName,
          role: 'HOSPITAL_ADMIN',
        },
      });

      // 2. Create Location
      const location = await tx.location.create({
        data: {
          address: data.location.address,
          city: data.location.city,
          state: data.location.state,
          zipCode: data.location.zipCode,
          country: data.location.country,
        },
      });

      // 3. Create Hospital
      const hospital = await tx.hospital.create({
        data: {
          name: data.name,
          description: data.description,
          adminId: user.id,
          locationId: location.id,
        },
      });

      return {
        user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName },
        hospital: { id: hospital.id, name: hospital.name }
      };
    });
  }
}
