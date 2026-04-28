import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum InstitutionType {
  HOSPITAL = 'HOSPITAL',
  CLINIC = 'CLINIC',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
}

export class SearchHospitalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(InstitutionType)
  type?: InstitutionType;
}
