import { AppService } from './app.service';
import { SearchService } from './search/search.service';
export declare class AppController {
    private readonly appService;
    private readonly searchService;
    constructor(appService: AppService, searchService: SearchService);
    getHello(): string;
    cleanupTestData(): Promise<{
        message: string;
    }>;
}
