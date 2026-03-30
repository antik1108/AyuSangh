import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsArray,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

/**
 * RegisterDoctorDto — FR-03.1
 * Captures all doctor profile fields including qualifications and consultation fee.
 */
export class RegisterDoctorDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(2)
  specialization: string;

  @IsInt()
  @Min(0)
  experienceYears: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  /** e.g. ["MBBS", "MD", "FRCS"] */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];

  /** Consultation fee in INR */
  @IsOptional()
  @IsNumber()
  @Min(0)
  consultationFee?: number;

  /** Link the doctor profile to an existing user account */
  @IsOptional()
  @IsUUID()
  userId?: string;
}
