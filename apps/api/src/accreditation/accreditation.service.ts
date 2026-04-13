import { Injectable, NotFoundException } from '@nestjs/common';
import { AccreditationRepository } from './accreditation.repository';
import { CreateAccreditationDto, UpdateAccreditationDto } from './dto/accreditation.dto';

@Injectable()
export class AccreditationService {
  constructor(private readonly accreditationRepo: AccreditationRepository) {}

  async getByHospital(hospitalId: string) {
    return this.accreditationRepo.findByHospital(hospitalId);
  }

  async getActive(hospitalId: string) {
    return this.accreditationRepo.findActive(hospitalId);
  }

  async getById(id: string) {
    const accreditation = await this.accreditationRepo.findById(id);
    if (!accreditation) throw new NotFoundException('Accreditation not found');
    return accreditation;
  }

  async create(dto: CreateAccreditationDto) {
    return this.accreditationRepo.create({
      name:      dto.name,
      issueDate: new Date(dto.issueDate),
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      hospital:  { connect: { id: dto.hospitalId } },
    });
  }

  async update(id: string, dto: UpdateAccreditationDto) {
    await this.getById(id);
    return this.accreditationRepo.update(id, {
      ...(dto.name      && { name:       dto.name }),
      ...(dto.issueDate && { issueDate:  new Date(dto.issueDate) }),
      ...(dto.expiryDate !== undefined && {
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      }),
    });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.accreditationRepo.delete(id);
    return { message: 'Accreditation deleted successfully' };
  }
}
