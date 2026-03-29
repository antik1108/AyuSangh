import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../common/repositories/base.repository';
import { Cost, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CostRepository extends BaseRepository<
  Cost,
  Prisma.CostCreateInput,
  Prisma.CostUpdateInput
> {
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.cost);
  }
}
