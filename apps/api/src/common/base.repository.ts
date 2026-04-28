import { DatabaseService } from '../database/database.service';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(protected readonly db: DatabaseService) {}

  protected abstract get model(): unknown;

  async findById(id: string): Promise<T | null> {
    const m = this.model as { findUnique: (args: unknown) => Promise<T | null> };
    return m.findUnique({ where: { id } });
  }

  async findAll(): Promise<T[]> {
    const m = this.model as { findMany: () => Promise<T[]> };
    return m.findMany();
  }

  async create(data: CreateInput): Promise<T> {
    const m = this.model as { create: (args: unknown) => Promise<T> };
    return m.create({ data });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    const m = this.model as { update: (args: unknown) => Promise<T> };
    return m.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    const m = this.model as { delete: (args: unknown) => Promise<T> };
    return m.delete({
      where: { id },
    });
  }
}
