import { IsString, IsOptional, IsEnum } from 'class-validator';
import { InstitutionType } from '@prisma/client';

/**
 * UpdateHospitalDto — PATCH /hospitals/:id
 *
 * Matches the sequence diagram: Admin Updates Institution Profile
 * Fields: description, phone, bookingLink (all optional — partial update)
 */
export class UpdateHospitalDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  bookingLink?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  openingHours?: string;

  @IsOptional()
  @IsEnum(InstitutionType)
  institutionType?: InstitutionType;

  @IsOptional()
  @IsString({ each: true })
  services?: string[];
}
