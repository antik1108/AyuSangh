import { Injectable, NotFoundException } from '@nestjs/common';
import { CostRepository } from './cost.repository';
import { CreateCostDto } from './dto/create-cost.dto';

@Injectable()
export class CostService {
  constructor(private readonly costRepository: CostRepository) {}

  async getHospitalCosts(hospitalId: string) {
    return this.costRepository['model'].findMany({
      where: { institutionId: hospitalId },
      orderBy: { serviceName: 'asc' },
    });
  }

  async addCost(hospitalId: string, dto: CreateCostDto) {
    return this.costRepository.create({
      institutionId: hospitalId,
      serviceName: dto.serviceName,
      price: dto.price,
    });
  }

  async deleteCost(hospitalId: string, costId: string) {
    const cost = await this.costRepository.findById(costId);
    if (!cost || cost.institutionId !== hospitalId) {
      throw new NotFoundException('Cost entry not found for this hospital');
    }
    await this.costRepository['model'].delete({ where: { id: costId } });
    return { success: true };
  }
}
