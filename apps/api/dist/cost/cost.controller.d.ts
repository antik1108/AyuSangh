import { CostService } from './cost.service';
export declare class CostController {
    private readonly costService;
    constructor(costService: CostService);
    getCosts(): Promise<{
        id: string;
        hospitalId: string;
        procedureName: string;
        estimatedCost: number;
    }[]>;
}
