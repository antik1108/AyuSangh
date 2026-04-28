import { IsString, IsNumber, Min } from 'class-validator';

export class CreateCostDto {
  @IsString()
  serviceName!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
