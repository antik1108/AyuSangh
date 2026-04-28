import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterHospitalDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  hospitalName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  hospitalType!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  city!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  pincode!: string;

  @IsString()
  @MinLength(5)
  @MaxLength(240)
  address!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1024)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  bookingLink?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  adminName!: string;

  @IsEmail()
  adminEmail!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  adminPassword!: string;
}
