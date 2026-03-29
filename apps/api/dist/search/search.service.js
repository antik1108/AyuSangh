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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const hospital_service_1 = require("../hospital/hospital.service");
const doctor_service_1 = require("../doctor/doctor.service");
const database_service_1 = require("../database/database.service");
let SearchService = class SearchService {
    hospitalService;
    doctorService;
    prisma;
    cacheTtlMs = 5 * 60 * 1000;
    searchCache = new Map();
    constructor(hospitalService, doctorService, prisma) {
        this.hospitalService = hospitalService;
        this.doctorService = doctorService;
        this.prisma = prisma;
    }
    async globalSearch(query) {
        const normalizedQuery = query.trim().toLowerCase();
        const cached = this.searchCache.get(normalizedQuery);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.data;
        }
        const [hospitals, doctors] = await Promise.all([
            this.hospitalService.search(query, undefined),
            this.doctorService.search(query),
        ]);
        const result = { hospitals, doctors };
        this.searchCache.set(normalizedQuery, {
            expiresAt: Date.now() + this.cacheTtlMs,
            data: result,
        });
        return result;
    }
    async cleanupTestData() {
        const deletedCount = await this.prisma.user.deleteMany({
            where: { email: { contains: 'check', mode: 'insensitive' } },
        });
        this.searchCache.clear();
        return { message: `Deleted ${deletedCount.count} test record(s)` };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hospital_service_1.HospitalService,
        doctor_service_1.DoctorService,
        database_service_1.DatabaseService])
], SearchService);
//# sourceMappingURL=search.service.js.map