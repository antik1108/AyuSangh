import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFavouriteDto {
  @IsString()
  @IsNotEmpty()
  hospitalId: string;
}

export class RemoveFavouriteDto {
  @IsString()
  @IsNotEmpty()
  hospitalId: string;
}
