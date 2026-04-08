"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./search.service");
const advanced_search_service_1 = require("./advanced-search.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SearchController = class SearchController {
    searchService;
    advancedSearchService;
    constructor(searchService, advancedSearchService) {
        this.searchService = searchService;
        this.advancedSearchService = advancedSearchService;
    }
    globalSearch(query) {
        if (!query)
            return { hospitals: [], doctors: [] };
        return this.searchService.globalSearch(query);
    }
    advancedSearch(query, type = 'all', limit = 20, offset = 0) {
        return this.advancedSearchService.search({
            query: query || '',
            type,
            limit: Math.min(limit, 100),
            offset: Math.max(offset, 0),
        });
    }
    advancedHospitalSearch(query, type, city, state, minRating, maxRating, limit = 20, offset = 0) {
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
    advancedDoctorSearch(query, specialization, city, minRating, maxRating, institutionId, limit = 20, offset = 0) {
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
    getNearbyHospitals(latitude, longitude, radiusKm = 5, limit = 20) {
        return this.advancedSearchService.findNearby({
            latitude: parseFloat(latitude.toString()),
            longitude: parseFloat(longitude.toString()),
            radiusKm: parseFloat(radiusKm.toString()),
            limit: Math.min(limit, 100),
        });
    }
    getHospitalsByFilters(type, city, state, minRating, limit = 20, offset = 0) {
        return this.advancedSearchService.getHospitalsByFilters({
            institutionType: type,
            city,
            state,
            minRating: minRating ? parseFloat(minRating.toString()) : undefined,
            limit: Math.min(limit, 100),
            offset: Math.max(offset, 0),
        });
    }
    getTrending(limit = 10) {
        return this.advancedSearchService.getTrendingSearches(Math.min(limit, 50));
    }
    cleanupTestData() {
        return this.searchService.cleanupTestData();
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "globalSearch", null);
__decorate([
    (0, common_1.Get)('advanced'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "advancedSearch", null);
__decorate([
    (0, common_1.Get)('hospitals/advanced'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('state')),
    __param(4, (0, common_1.Query)('minRating')),
    __param(5, (0, common_1.Query)('maxRating')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "advancedHospitalSearch", null);
__decorate([
    (0, common_1.Get)('doctors/advanced'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('specialization')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('minRating')),
    __param(4, (0, common_1.Query)('maxRating')),
    __param(5, (0, common_1.Query)('institutionId')),
    __param(6, (0, common_1.Query)('limit')),
    __param(7, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, String, Number, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "advancedDoctorSearch", null);
__decorate([
    (0, common_1.Get)('hospitals/nearby'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "getNearbyHospitals", null);
__decorate([
    (0, common_1.Get)('hospitals/filters'),
    __param(0, (0, common_1.Query)('type')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('state')),
    __param(3, (0, common_1.Query)('minRating')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Query)('offset')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "getHospitalsByFilters", null);
__decorate([
    (0, common_1.Get)('trending'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "getTrending", null);
__decorate([
    (0, common_1.Post)('cleanup-test-data'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.PLATFORM_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "cleanupTestData", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService,
        advanced_search_service_1.AdvancedSearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map