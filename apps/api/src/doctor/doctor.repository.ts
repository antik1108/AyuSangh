import { Injectable } from '@nestjs/common';
import { Doctor, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DoctorRepository extends BaseRepository<
  Doctor,
  Prisma.DoctorCreateInput | Prisma.DoctorUncheckedCreateInput,
  Prisma.DoctorUpdateInput | Prisma.DoctorUncheckedUpdateInput
> {
  constructor(db: DatabaseService) {
    super(db);
  }

  protected get model() {
    return this.db.doctor;
  }

  async searchBySpecialization(query?: string): Promise<Doctor[]> {
    if (!query) {
      return this.model.findMany({ include: { user: { select: { name: true } } } });
    }
    return this.model.findMany({
      where: {
        specialty: { contains: query, mode: 'insensitive' },
      },
      include: { user: { select: { name: true } } }
    });
  }

  async findWithInstitutions(id: string) {
    return this.model.findUnique({
      where: { id },
      include: {
        institutions: {
          include: {
            institution: true,
          },
        },
        reviews: true,
        user: { select: { name: true, email: true } }
      },
    });
  }

  async linkToHospital(doctorId: string, hospitalId: string) {
    return this.db.doctorInstitution.create({
      data: {
        doctorId,
        institutionId: hospitalId,
      },
    });
  }

  async unlinkFromHospital(doctorId: string, hospitalId: string) {
    return this.db.doctorInstitution.delete({
      where: {
        doctorId_institutionId: {
          doctorId,
          institutionId: hospitalId,
        },
      },
    });
  }
}
