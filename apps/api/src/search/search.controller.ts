import { Controller, Get, Query, ParseFloatPipe, BadRequestException } from '@nestjs/common';
import { SearchService } from './search.service';
import { AdvancedSearchService } from './advanced-search.service';
import { SearchDto } from './dto/search.dto';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly advancedSearchService: AdvancedSearchService,
  ) {}

  @Get()
  async globalSearch(@Query('q') q: string) {
    return this.searchService.globalSearch(q);
  }

  @Get('hospitals')
  async advancedHospitalSearch(@Query() options: SearchDto) {
    return this.advancedSearchService.advancedHospitalSearch(options);
  }

  @Get('doctors')
  async advancedDoctorSearch(@Query() options: SearchDto) {
    return this.advancedSearchService.advancedDoctorSearch(options);
  }

  @Get('nearby')
  async findNearby(
    @Query('lat') latStr: string,
    @Query('lng') lngStr: string,
    @Query('limit') limitStr?: string,
  ) {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const limit = limitStr ? parseInt(limitStr, 10) : 10;

    if (isNaN(lat) || isNaN(lng)) {
      throw new BadRequestException('Valid lat and lng query parameters are required.');
    }

    return this.advancedSearchService.findNearby(lat, lng, limit);
  }

  @Get('trending')
  async getTrendingSearches() {
    return this.advancedSearchService.getTrendingSearches();
  }
}
