import { IsString, IsInt, IsNumber, IsOptional } from 'class-validator';

export class RegisterDoctorDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsString()
  name!: string;

  @IsString()
  specialty!: string;

  @IsInt()
  experience!: number;

  @IsNumber()
  consultationFee!: number;

  @IsOptional()
  @IsString()
  qualifications?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
