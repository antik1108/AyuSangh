import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    globalSearch(query: string): Promise<{
        hospitals: unknown[];
        doctors: unknown[];
    }> | {
        hospitals: never[];
        doctors: never[];
    };
}
