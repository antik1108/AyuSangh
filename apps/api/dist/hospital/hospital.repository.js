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
exports.HospitalRepository = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../common/repositories/base.repository");
const database_service_1 = require("../database/database.service");
let HospitalRepository = class HospitalRepository extends base_repository_1.BaseRepository {
    prisma;
    constructor(prisma) {
        super(prisma.hospital);
        this.prisma = prisma;
    }
    async searchHospitals(nameQuery, cityQuery) {
        return this.prisma.hospital.findMany({
            where: {
                ...(nameQuery && {
                    OR: [
                        { name: { contains: nameQuery, mode: 'insensitive' } },
                        { description: { contains: nameQuery, mode: 'insensitive' } },
                        { location: { city: { contains: nameQuery, mode: 'insensitive' } } },
                        { location: { state: { contains: nameQuery, mode: 'insensitive' } } },
                    ],
                }),
                ...(cityQuery && { location: { city: { contains: cityQuery, mode: 'insensitive' } } }),
            },
            include: {
                location: true,
                departments: true,
                accreditations: true,
            }
        });
    }
};
exports.HospitalRepository = HospitalRepository;
exports.HospitalRepository = HospitalRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], HospitalRepository);
//# sourceMappingURL=hospital.repository.js.map