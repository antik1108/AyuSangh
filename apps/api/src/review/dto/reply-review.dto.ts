import { IsString, MinLength } from 'class-validator';

export class ReplyReviewDto {
  @IsString()
  @MinLength(5)
  text!: string;
}
