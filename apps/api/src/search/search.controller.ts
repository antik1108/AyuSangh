import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { AdvancedSearchService, type SearchResult } from './advanced-search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly advancedSearchService: AdvancedSearchService,
  ) {}

  @Get()
  globalSearch(@Query('q') query: string) {
    if (!query) return { hospitals: [], doctors: [] };
    return this.searchService.globalSearch(query);
  }

  @Get('advanced')
  advancedSearch(
    @Query('q') query: string,
    @Query('type') type: 'hospital' | 'doctor' | 'all' = 'all',
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.advancedSearchService.search({
      query: query || '',
      type,
      limit: Math.min(limit, 100),
      offset: Math.max(offset, 0),
    });
  }

  @Get('hospitals/advanced')
  advancedHospitalSearch(
    @Query('q') query: string,
    @Query('type') type: string,
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('minRating') minRating: number,
    @Query('maxRating') maxRating: number,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.advancedSearchService.advancedHospitalSearch({
      query,
      institutionType: type,
      city,
      state,
      minRating: minRating ? parseFloat(minRating.toString()) : undefined,
      maxRating: maxRating ? parseFloat(maxRating.toString()) : undefined,
      limit: Math.min(limit, 100),
      offset: Math.max(offset, 0),
    });
  }

  @Get('doctors/advanced')
  advancedDoctorSearch(
    @Query('q') query: string,
    @Query('specialization') specialization: string,
    @Query('city') city: string,
    @Query('minRating') minRating: number,
    @Query('maxRating') maxRating: number,
    @Query('institutionId') institutionId: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.advancedSearchService.advancedDoctorSearch({
      query,
      specialization,
      city,
      minRating: minRating ? parseFloat(minRating.toString()) : undefined,
      maxRating: maxRating ? parseFloat(maxRating.toString()) : undefined,
      institutionId,
      limit: Math.min(limit, 100),
      offset: Math.max(offset, 0),
    });
  }

  @Get('hospitals/nearby')
  getNearbyHospitals(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('radius') radiusKm: number = 5,
    @Query('limit') limit: number = 20,
  ) {
    return this.advancedSearchService.findNearby({
      latitude: parseFloat(latitude.toString()),
      longitude: parseFloat(longitude.toString()),
      radiusKm: parseFloat(radiusKm.toString()),
      limit: Math.min(limit, 100),
    });
  }

  @Get('hospitals/filters')
  getHospitalsByFilters(
    @Query('type') type: string,
    @Query('city') city: string,
    @Query('state') state: string,
    @Query('minRating') minRating: number,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ) {
    return this.advancedSearchService.getHospitalsByFilters({
      institutionType: type,
      city,
      state,
      minRating: minRating ? parseFloat(minRating.toString()) : undefined,
      limit: Math.min(limit, 100),
      offset: Math.max(offset, 0),
    });
  }

  @Get('trending')
  getTrending(@Query('limit') limit: number = 10) {
    return this.advancedSearchService.getTrendingSearches(
      Math.min(limit, 50),
    );
  }
}
