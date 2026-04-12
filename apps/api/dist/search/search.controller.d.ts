import { SearchService } from './search.service';
import { AdvancedSearchService, type SearchResult } from './advanced-search.service';
export declare class SearchController {
    private readonly searchService;
    private readonly advancedSearchService;
    constructor(searchService: SearchService, advancedSearchService: AdvancedSearchService);
    globalSearch(query: string): unknown;
    advancedSearch(query: string, type?: 'hospital' | 'doctor' | 'all', limit?: number, offset?: number): Promise<SearchResult>;
    advancedHospitalSearch(query: string, type: string, city: string, state: string, minRating: number, maxRating: number, limit?: number, offset?: number): unknown;
    advancedDoctorSearch(query: string, specialization: string, city: string, minRating: number, maxRating: number, institutionId: string, limit?: number, offset?: number): unknown;
    getNearbyHospitals(latitude: number, longitude: number, radiusKm?: number, limit?: number): unknown;
    getHospitalsByFilters(type: string, city: string, state: string, minRating: number, limit?: number, offset?: number): unknown;
    getTrending(limit?: number): Promise<{}>;
}
