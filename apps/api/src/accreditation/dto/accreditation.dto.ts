import { IsString, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateAccreditationDto {
  @IsString()
  name: string;

  @IsDateString()
  issueDate: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsUUID()
  hospitalId: string;
}

export class UpdateAccreditationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}
