import { CostRepository } from './cost.repository';
export declare class CostService {
    private readonly repo;
    constructor(repo: CostRepository);
    getAll(): Promise<{
        id: string;
        hospitalId: string;
        procedureName: string;
        estimatedCost: number;
    }[]>;
}
