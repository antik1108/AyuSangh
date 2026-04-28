import { IsString, IsOptional, IsEnum, IsNumber, IsUrl } from 'class-validator';
import { InstitutionType } from './search-hospital.dto';

export class CreateHospitalDto {
  @IsString()
  name!: string;

  @IsEnum(InstitutionType)
  type!: InstitutionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  city!: string;

  @IsString()
  pincode!: string;

  @IsString()
  address!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsUrl()
  bookingLink?: string;

  // Location fields to be created in transaction
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsUrl()
  googleMapsUrl?: string;
}
