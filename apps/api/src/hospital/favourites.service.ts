import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Favourite, Hospital, Location, Review } from '@prisma/client';

export interface FavouriteWithHospital extends Favourite {
  hospital: Hospital & {
    location: Location;
    reviews: Review[];
  };
}

@Injectable()
export class FavouritesService {
  constructor(private databaseService: DatabaseService) {}

  async addToFavourites(userId: string, hospitalId: string): Promise<Favourite> {
    return this.databaseService.favourite.create({
      data: { userId, hospitalId },
    });
  }

  async removeFromFavourites(userId: string, hospitalId: string): Promise<void> {
    await this.databaseService.favourite.deleteMany({
      where: { userId, hospitalId },
    });
  }

  async getUserFavourites(userId: string): Promise<FavouriteWithHospital[]> {
    return this.databaseService.favourite.findMany({
      where: { userId },
      include: {
        hospital: {
          include: {
            location: true,
            reviews: true,
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    }) as Promise<FavouriteWithHospital[]>;
  }

  async isFavourite(userId: string, hospitalId: string): Promise<boolean> {
    const favourite = await this.databaseService.favourite.findUnique({
      where: {
        userId_hospitalId: { userId, hospitalId },
      },
    });
    return !!favourite;
  }

  async getFavouriteCount(hospitalId: string): Promise<number> {
    return this.databaseService.favourite.count({
      where: { hospitalId },
    });
  }
}
