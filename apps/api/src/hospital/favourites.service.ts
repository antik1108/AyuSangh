import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavouritesService {
  constructor(private readonly db: DatabaseService) {}

  async addToFavourites(userId: string, hospitalId: string) {
    return this.db.favourite.create({
      data: {
        userId,
        institutionId: hospitalId,
      },
    });
  }

  async removeFromFavourites(userId: string, hospitalId: string) {
    return this.db.favourite.delete({
      where: {
        userId_institutionId: {
          userId,
          institutionId: hospitalId,
        },
      },
    });
  }

  async getUserFavourites(userId: string) {
    return this.db.favourite.findMany({
      where: { userId },
      include: {
        institution: true,
      },
    });
  }

  async isFavourite(userId: string, hospitalId: string): Promise<boolean> {
    const favourite = await this.db.favourite.findUnique({
      where: {
        userId_institutionId: {
          userId,
          institutionId: hospitalId,
        },
      },
    });
    return !!favourite;
  }
}
