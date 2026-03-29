import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavouritesService {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Add a hospital to user's favourites
   */
  async addToFavourites(userId: string, hospitalId: string) {
    return await this.databaseService.favourite.create({
      data: {
        userId,
        hospitalId,
      },
    });
  }

  /**
   * Remove a hospital from user's favourites
   */
  async removeFromFavourites(
    userId: string,
    hospitalId: string,
  ): Promise<void> {
    await this.databaseService.favourite.deleteMany({
      where: {
        userId,
        hospitalId,
      },
    });
  }

  /**
   * Get all favourite hospitals for a user
   */
  async getUserFavourites(userId: string) {
    return await this.databaseService.favourite.findMany({
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
    });
  }

  /**
   * Check if a hospital is in user's favourites
   */
  async isFavourite(userId: string, hospitalId: string): Promise<boolean> {
    const favourite = await this.databaseService.favourite.findUnique({
      where: {
        userId_hospitalId: {
          userId,
          hospitalId,
        },
      },
    });

    return !!favourite;
  }

  /**
   * Get favourite count for a hospital
   */
  async getFavouriteCount(hospitalId: string): Promise<number> {
    return await this.databaseService.favourite.count({
      where: { hospitalId },
    });
  }
}
