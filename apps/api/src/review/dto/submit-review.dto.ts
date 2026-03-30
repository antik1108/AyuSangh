import { IsString, IsInt, IsOptional, Min, Max, IsUUID } from 'class-validator';

/**
 * SubmitReviewDto — FR-04.2
 *
 * Captures all four rating dimensions (1–5 each) plus optional review text.
 * Either hospitalId or doctorId must be provided (validated in service layer).
 */
export class SubmitReviewDto {
  /** Overall experience rating (1–5) */
  @IsInt()
  @Min(1)
  @Max(5)
  ratingOverall: number;

  /** Cleanliness & hygiene rating (1–5) */
  @IsInt()
  @Min(1)
  @Max(5)
  ratingCleanliness: number;

  /** Staff behaviour & attitude rating (1–5) */
  @IsInt()
  @Min(1)
  @Max(5)
  ratingStaffBehaviour: number;

  /** Wait time rating (1–5, where 5 = minimal wait) */
  @IsInt()
  @Min(1)
  @Max(5)
  ratingWaitTime: number;

  /** Optional written review text */
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

/**
 * UpdateReviewDto — allows partial update of ratings and text.
 * Re-submits the review for moderation on save.
 */
export class UpdateReviewDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingOverall?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingCleanliness?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingStaffBehaviour?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingWaitTime?: number;

  @IsOptional()
  @IsString()
  text?: string;
}

export class ReplyToReviewDto {
  @IsString()
  replyText: string;
}
