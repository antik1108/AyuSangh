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
exports.DoctorService = void 0;
const common_1 = require("@nestjs/common");
const doctor_repository_1 = require("./doctor.repository");
const database_service_1 = require("../database/database.service");
let DoctorService = class DoctorService {
    doctorRepo;
    prisma;
    constructor(doctorRepo, prisma) {
        this.doctorRepo = doctorRepo;
        this.prisma = prisma;
    }
    async search(specialization) {
        return this.doctorRepo.searchDoctors(specialization);
    }
    async getProfile(id) {
        return this.prisma.doctor.findUnique({
            where: { id },
            include: {
                reviews: true,
                institutions: {
                    include: {
                        hospital: { include: { location: true } },
                    },
                },
            },
        });
    }
    async registerDoctor(data) {
        return this.doctorRepo.create({
            firstName: data.firstName,
            lastName: data.lastName,
            specialization: data.specialization,
            experienceYears: data.experienceYears,
            bio: data.bio,
            user: { connect: { id: data.userId } }
        });
    }
};
exports.DoctorService = DoctorService;
exports.DoctorService = DoctorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [doctor_repository_1.DoctorRepository,
        database_service_1.DatabaseService])
], DoctorService);
//# sourceMappingURL=doctor.service.js.map