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
exports.DoctorRepository = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../common/repositories/base.repository");
const database_service_1 = require("../database/database.service");
let DoctorRepository = class DoctorRepository extends base_repository_1.BaseRepository {
    prisma;
    constructor(prisma) {
        super(prisma.doctor);
        this.prisma = prisma;
    }
    async searchDoctors(query) {
        return this.prisma.doctor.findMany({
            where: {
                ...(query && {
                    OR: [
                        { specialization: { contains: query, mode: 'insensitive' } },
                        { firstName: { contains: query, mode: 'insensitive' } },
                        { lastName: { contains: query, mode: 'insensitive' } },
                        { bio: { contains: query, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                reviews: true,
            },
        });
    }
};
exports.DoctorRepository = DoctorRepository;
exports.DoctorRepository = DoctorRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DoctorRepository);
//# sourceMappingURL=doctor.repository.js.map