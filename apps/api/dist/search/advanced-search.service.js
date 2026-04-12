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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvancedSearchService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let AdvancedSearchService = class AdvancedSearchService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async search(options) {
        const { query, type = 'all', limit = 20, offset = 0 } = options;
        const searchTerm = this._escapeSearchTerm(query);
        const result = {};
        if (type === 'hospital' || type === 'all') {
            result.hospital = await this._searchHospitals(searchTerm, limit, offset);
        }
        if (type === 'doctor' || type === 'all') {
            result.doctor = await this._searchDoctors(searchTerm, limit, offset);
        }
        return result;
    }
    async advancedHospitalSearch(options) {
        const { query, institutionType, city, state, minRating, maxRating, limit = 20, offset = 0, } = options;
        const where = {};
        if (institutionType) {
            where.institutionType = institutionType;
        }
        if (city) {
            where.location = { city: { contains: city, mode: 'insensitive' } };
        }
        if (state) {
            if (where.location) {
                where.location.state = {
                    contains: state,
                    mode: 'insensitive',
                };
            }
            else {
                where.location = { state: { contains: state, mode: 'insensitive' } };
            }
        }
        if (minRating !== undefined || maxRating !== undefined) {
            where.rating = {};
            if (minRating !== undefined) {
                where.rating.gte = minRating;
            }
            if (maxRating !== undefined) {
                where.rating.lte = maxRating;
            }
        }
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }
        return this.databaseService.hospital.findMany({
            where: where,
            include: {
                location: true,
                reviews: { select: { rating: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
    }
    async advancedDoctorSearch(options) {
        const { query, specialization, city, minRating, maxRating, institutionId, limit = 20, offset = 0, } = options;
        const where = {};
        if (specialization) {
            where.specialization = {
                contains: specialization,
                mode: 'insensitive',
            };
        }
        if (institutionId) {
            where.institutions = {
                some: { hospitalId: institutionId },
            };
        }
        if (query) {
            where.OR = [
                { firstName: { contains: query, mode: 'insensitive' } },
                { lastName: { contains: query, mode: 'insensitive' } },
                { specialization: { contains: query, mode: 'insensitive' } },
                { bio: { contains: query, mode: 'insensitive' } },
            ];
        }
        const doctors = await this.databaseService.doctor.findMany({
            where: where,
            include: {
                reviews: { select: { rating: true } },
                institutions: {
                    include: { hospital: { include: { location: true } } },
                },
            },
            take: limit,
            skip: offset,
        });
        if (!city && minRating === undefined && maxRating === undefined) {
            return doctors;
        }
        return doctors.filter((doctor) => {
            if (city) {
                const hasCity = doctor.institutions.some((di) => di.hospital.location.city.toLowerCase().includes(city.toLowerCase()));
                if (!hasCity)
                    return false;
            }
            if (doctor.reviews.length > 0) {
                const avgRating = doctor.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    doctor.reviews.length;
                if (minRating !== undefined && avgRating < minRating)
                    return false;
                if (maxRating !== undefined && avgRating > maxRating)
                    return false;
            }
            return true;
        });
    }
    async getTrendingSearches(limit = 10) {
        const hospitals = await this.databaseService.hospital.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: { name: true },
        });
        return hospitals.map((h) => h.name);
    }
    async findNearby(options) {
        const { latitude, longitude, radiusKm = 5, limit = 20 } = options;
        const hospitals = await this.databaseService.$queryRaw `
      SELECT 
        h.id,
        h.name,
        h."institutionType",
        h.rating,
        l.address,
        l.city,
        l.state,
        l.latitude,
        l.longitude,
        SQRT(
          POWER(l.latitude - ${latitude}, 2) + 
          POWER(l.longitude - ${longitude}, 2)
        ) * 111 AS distance_km
      FROM "Hospital" h
      JOIN "Location" l ON h."locationId" = l.id
      WHERE SQRT(
        POWER(l.latitude - ${latitude}, 2) + 
        POWER(l.longitude - ${longitude}, 2)
      ) * 111 <= ${radiusKm}
      ORDER BY distance_km ASC
      LIMIT ${limit}
    `;
        return hospitals;
    }
    async getHospitalsByFilters(filters) {
        const { institutionType, city, state, minRating, limit = 20, offset = 0, } = filters;
        const where = {};
        if (institutionType) {
            where.institutionType = institutionType;
        }
        if (city || state) {
            where.location = {};
            if (city) {
                where.location.city = {
                    contains: city,
                    mode: 'insensitive',
                };
            }
            if (state) {
                where.location.state = {
                    contains: state,
                    mode: 'insensitive',
                };
            }
        }
        if (minRating !== undefined) {
            where.rating = { gte: minRating };
        }
        return this.databaseService.hospital.findMany({
            where: where,
            include: {
                location: true,
                reviews: true,
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
    }
    async _searchHospitals(searchTerm, limit, offset) {
        return this.databaseService.hospital.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            include: {
                location: true,
                reviews: { select: { rating: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
    }
    async _searchDoctors(searchTerm, limit, offset) {
        return this.databaseService.doctor.findMany({
            where: {
                OR: [
                    { firstName: { contains: searchTerm, mode: 'insensitive' } },
                    { lastName: { contains: searchTerm, mode: 'insensitive' } },
                    { specialization: { contains: searchTerm, mode: 'insensitive' } },
                    { bio: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            include: {
                reviews: { select: { rating: true } },
                institutions: {
                    include: { hospital: { include: { location: true } } },
                },
            },
            take: limit,
            skip: offset,
        });
    }
    _escapeSearchTerm(term) {
        return term.replace(/[&|!()'"<>*]/g, '\\$&').trim();
    }
};
exports.AdvancedSearchService = AdvancedSearchService;
exports.AdvancedSearchService = AdvancedSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AdvancedSearchService);
//# sourceMappingURL=advanced-search.service.js.map