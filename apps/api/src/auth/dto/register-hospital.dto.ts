import { IsEmail, IsNotEmpty, IsOptional, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminUserDto {
  @IsEmail({}, { message: 'Invalid admin email address' })
  @IsNotEmpty({ message: 'Admin email is required' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsNotEmpty({ message: 'Admin first name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'Admin last name is required' })
  lastName: string;
}

export class LocationDto {
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsNotEmpty({ message: 'State is required' })
  state: string;

  @IsNotEmpty({ message: 'Zip code is required' })
  zipCode: string;

  @IsNotEmpty({ message: 'Country is required' })
  country: string;
}

export class RegisterHospitalDto {
  @IsNotEmpty({ message: 'Hospital name is required' })
  name: string;

  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => AdminUserDto)
  admin: AdminUserDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
