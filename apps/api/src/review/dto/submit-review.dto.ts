import { IsString, IsInt, IsOptional, Min, Max, IsUUID } from 'class-validator';

export class SubmitReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsUUID()
  hospitalId?: string;

  @IsOptional()
  @IsUUID()
  doctorId?: string;
}

export class ApproveReviewDto {
  @IsUUID()
  reviewId: string;
}

export class RejectReviewDto {
  @IsUUID()
  reviewId: string;
}

export class ReplyToReviewDto {
  @IsUUID()
  reviewId: string;

  @IsString()
  replyText: string;
}
