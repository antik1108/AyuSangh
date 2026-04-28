import { IsString, MinLength, Min, Max, IsInt, IsOptional, IsUUID } from 'class-validator';

export class SubmitReviewDto {
  @IsString()
  @MinLength(10)
  text!: string;

  @Min(1)
  @Max(5)
  @IsInt()
  ratingOverall!: number;

  @Min(1)
  @Max(5)
  @IsInt()
  ratingCleanliness!: number;

  @Min(1)
  @Max(5)
  @IsInt()
  ratingStaffBehaviour!: number;

  @Min(1)
  @Max(5)
  @IsInt()
  ratingWaitTime!: number;

  @IsOptional()
  @IsUUID()
  hospitalId?: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;
}
