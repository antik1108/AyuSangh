import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from './hospital.repository';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { SearchHospitalDto } from './dto/search-hospital.dto';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HospitalService {
  constructor(
    private readonly hospitalRepository: HospitalRepository,
    private readonly db: DatabaseService,
  ) {}

  async search(searchDto: SearchHospitalDto) {
    const { name, city, type } = searchDto;
    return this.hospitalRepository.searchByFilters(name, city, type);
  }

  async getProfile(id: string) {
    const profile = await this.hospitalRepository.findWithDetails(id);
    if (!profile) {
      throw new NotFoundException('Hospital not found');
    }
    return profile;
  }

  async register(createHospitalDto: CreateHospitalDto, userId: string) {
    return this.db.$transaction(async (prisma) => {
      const { latitude, longitude, googleMapsUrl, ...institutionData } = createHospitalDto;

      const institution = await prisma.institution.create({
        data: {
          ...institutionData,
          location: {
            create: {
              latitude,
              longitude,
              googleMapsUrl,
            },
          },
        },
      });

      // Note: In a real app we might link the hospital with the admin user (userId) here if schema supported it.
      return institution;
    });
  }

  async update(id: string, updateHospitalDto: UpdateHospitalDto, userId: string) {
    const hospital = await this.hospitalRepository.findById(id);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }

    const updateData: Prisma.InstitutionUpdateInput = {};
    if (updateHospitalDto.name) updateData.name = updateHospitalDto.name;
    if (updateHospitalDto.type) updateData.type = updateHospitalDto.type;
    if (updateHospitalDto.description !== undefined) updateData.description = updateHospitalDto.description;
    if (updateHospitalDto.city) updateData.city = updateHospitalDto.city;
    if (updateHospitalDto.pincode) updateData.pincode = updateHospitalDto.pincode;
    if (updateHospitalDto.address) updateData.address = updateHospitalDto.address;
    if (updateHospitalDto.phone) updateData.phone = updateHospitalDto.phone;
    if (updateHospitalDto.bookingLink !== undefined) updateData.bookingLink = updateHospitalDto.bookingLink;

    return this.hospitalRepository.update(id, updateData);
  }
}
