import { Injectable } from '@nestjs/common';
import { CostRepository } from './cost.repository';

@Injectable()
export class CostService {
  constructor(private readonly repo: CostRepository) {}

  getAll() {
    return this.repo.findAll();
  }
}
