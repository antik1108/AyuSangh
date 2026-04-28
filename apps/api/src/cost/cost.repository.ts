import { Injectable } from '@nestjs/common';
import { Cost, Prisma } from '@prisma/client';
import { BaseRepository } from '../common/base.repository';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CostRepository extends BaseRepository<
  Cost,
  Prisma.CostCreateInput | Prisma.CostUncheckedCreateInput,
  Prisma.CostUpdateInput | Prisma.CostUncheckedUpdateInput
> {
  constructor(db: DatabaseService) {
    super(db);
  }

  protected get model() {
    return this.db.cost;
  }
}
