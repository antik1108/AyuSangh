import { CostRepository } from './cost.repository';
export declare class CostService {
    private readonly repo;
    constructor(repo: CostRepository);
    getAll(): Promise<{}>;
}
