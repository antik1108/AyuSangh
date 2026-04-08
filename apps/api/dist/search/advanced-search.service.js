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
function isValidInstitutionType(value) {
    if (!value)
        return false;
    const validTypes = [
        'HOSPITAL',
        'CLINIC',
        'DIAGNOSTIC_CENTRE',
        'NURSING_HOME',
    ];
    return validTypes.includes(value);
}
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
        if (institutionType && isValidInstitutionType(institutionType)) {
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
        if (minRating !== undefined || maxRating !== undefined) {
            const ratingFilter = {};
            if (minRating !== undefined) {
                ratingFilter.gte = minRating;
            }
            if (maxRating !== undefined) {
                ratingFilter.lte = maxRating;
            }
            where.rating = ratingFilter;
        }
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }
        const hospitals = await this.databaseService.hospital.findMany({
            where,
            include: {
                location: true,
                reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
        return hospitals;
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
            where,
            include: {
                reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
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
                const hasCity = doctor.institutions.some((di) => {
                    const doctorCity = di.hospital.location?.city ?? '';
                    return doctorCity.toLowerCase().includes(city.toLowerCase());
                });
                if (!hasCity)
                    return false;
            }
            const d = doctor;
            if (d.reviews && d.reviews.length > 0) {
                const avgRating = d.reviews.reduce((sum, r) => sum + (r.ratingOverall ?? 0), 0) /
                    d.reviews.length;
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
        h."adminId",
        h."locationId",
        h.phone,
        h.website,
        h.email,
        h."profilePhoto",
        h."isActive",
        h."createdAt",
        h."updatedAt",
        l.id as location_id,
        l.address,
        l.city,
        l.state,
        l."zipCode",
        l.country,
        l.latitude,
        l.longitude,
        SQRT(
          POWER(CAST(l.latitude AS float) - ${latitude}, 2) + 
          POWER(CAST(l.longitude AS float) - ${longitude}, 2)
        ) * 111 AS distance_km
      FROM "Hospital" h
      JOIN "Location" l ON h."locationId" = l.id
      WHERE SQRT(
        POWER(CAST(l.latitude AS float) - ${latitude}, 2) + 
        POWER(CAST(l.longitude AS float) - ${longitude}, 2)
      ) * 111 <= ${radiusKm}
      ORDER BY distance_km ASC
      LIMIT ${limit}
    `;
        return hospitals;
    }
    async getHospitalsByFilters(filters) {
        const { institutionType, city, state, minRating, limit = 20, offset = 0, } = filters;
        const where = {};
        if (institutionType && isValidInstitutionType(institutionType)) {
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
        const hospitals = await this.databaseService.hospital.findMany({
            where,
            include: {
                location: true,
                reviews: true,
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
        return hospitals;
    }
    async _searchHospitals(searchTerm, limit, offset) {
        const hospitals = await this.databaseService.hospital.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            include: {
                location: true,
                reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
            },
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
        });
        return hospitals;
    }
    async _searchDoctors(searchTerm, limit, offset) {
        const doctors = await this.databaseService.doctor.findMany({
            where: {
                OR: [
                    { firstName: { contains: searchTerm, mode: 'insensitive' } },
                    { lastName: { contains: searchTerm, mode: 'insensitive' } },
                    { specialization: { contains: searchTerm, mode: 'insensitive' } },
                    { bio: { contains: searchTerm, mode: 'insensitive' } },
                ],
            },
            include: {
                reviews: { select: { ratingOverall: true, ratingCleanliness: true, ratingStaffBehaviour: true, ratingWaitTime: true } },
                institutions: {
                    include: { hospital: { include: { location: true } } },
                },
            },
            take: limit,
            skip: offset,
        });
        return doctors;
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