import { Injectable } from '@nestjs/common';
import { RefreshToken, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RefreshTokenRepository extends BaseRepository<
  RefreshToken,
  Prisma.RefreshTokenUncheckedCreateInput,
  Prisma.RefreshTokenUncheckedUpdateInput
> {
  constructor(db: DatabaseService) {
    super(db);
  }

  protected get model() {
    return this.db.refreshToken;
  }

  async findValidToken(userId: string): Promise<RefreshToken | null> {
    return this.model.findFirst({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserTokens(userId: string): Promise<RefreshToken[]> {
    return this.model.findMany({
      where: {
        userId,
        revokedAt: null,
      },
    });
  }

  async revokeToken(id: string): Promise<RefreshToken> {
    return this.model.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }
}
