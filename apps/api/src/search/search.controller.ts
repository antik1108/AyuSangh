import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  globalSearch(@Query('q') query: string) {
    if (!query) return { hospitals: [], doctors: [] };
    return this.searchService.globalSearch(query);
  }
}
