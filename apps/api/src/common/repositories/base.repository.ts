import { Prisma } from '@prisma/client';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected constructor(protected readonly model: {
    findUnique: (args: any) => Promise<T | null>;
    findMany: (args?: any) => Promise<T[]>;
    create: (args: { data: CreateInput }) => Promise<T>;
    update: (args: { where: { id: string }; data: UpdateInput }) => Promise<T>;
    delete: (args: { where: { id: string } }) => Promise<T>;
  }) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}
