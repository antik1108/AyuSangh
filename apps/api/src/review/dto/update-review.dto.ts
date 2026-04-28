import { PartialType } from '@nestjs/mapped-types';
import { SubmitReviewDto } from './submit-review.dto';

export class UpdateReviewDto extends PartialType(SubmitReviewDto) {}
