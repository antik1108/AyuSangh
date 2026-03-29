import { Controller, Get } from '@nestjs/common';
import { CostService } from './cost.service';

@Controller('costs')
export class CostController {
  constructor(private readonly costService: CostService) {}

  @Get()
  getCosts() {
    return this.costService.getAll();
  }
}
