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
exports.HospitalService = void 0;
const common_1 = require("@nestjs/common");
const hospital_repository_1 = require("./hospital.repository");
let HospitalService = class HospitalService {
    hospitalRepo;
    constructor(hospitalRepo) {
        this.hospitalRepo = hospitalRepo;
    }
    async search(name, city) {
        return this.hospitalRepo.searchHospitals(name, city);
    }
    async getProfile(id) {
        return this.hospitalRepo.findById(id);
    }
    async registerHospital(data) {
        return this.hospitalRepo.create({
            name: data.name,
            description: data.description,
            admin: { connect: { id: data.adminId } },
            location: {
                create: {
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: data.country,
                },
            },
        });
    }
    async updateInstitution(userId, userRole, institutionId, dto) {
        const hospital = await this.hospitalRepo.findById(institutionId);
        if (!hospital)
            throw new common_1.NotFoundException('Hospital not found');
        if (userRole !== 'PLATFORM_ADMIN' && hospital.adminId !== userId) {
            throw new common_1.ForbiddenException('You do not own this institution');
        }
        return this.hospitalRepo.updateInstitution(institutionId, dto);
    }
    async recalculateAndPersistRating(hospitalId) {
        const hospital = await this.hospitalRepo.findById(hospitalId);
        if (!hospital)
            return;
        const reviews = await this.hospitalRepo.findApprovedReviews(hospitalId);
        if (reviews.length === 0)
            return;
        const count = reviews.length;
        const round = (n) => Math.round((n / count) * 10) / 10;
        const totals = reviews.reduce((acc, r) => ({
            overall: acc.overall + r.ratingOverall,
            cleanliness: acc.cleanliness + r.ratingCleanliness,
            staffBehaviour: acc.staffBehaviour + r.ratingStaffBehaviour,
            waitTime: acc.waitTime + r.ratingWaitTime,
        }), { overall: 0, cleanliness: 0, staffBehaviour: 0, waitTime: 0 });
        await this.hospitalRepo.updateInstitutionRating(hospitalId, {
            rating: round(totals.overall),
            ratingCleanliness: round(totals.cleanliness),
            ratingStaffBehaviour: round(totals.staffBehaviour),
            ratingWaitTime: round(totals.waitTime),
        });
    }
    async updateProfilePhoto(hospitalId, photoUrl) {
        const hospital = await this.hospitalRepo.findById(hospitalId);
        if (!hospital)
            throw new common_1.NotFoundException('Hospital not found');
        return this.hospitalRepo.updateProfilePhoto(hospitalId, photoUrl);
    }
    async addImages(hospitalId, uploadResults) {
        const hospital = await this.hospitalRepo.findById(hospitalId);
        if (!hospital)
            throw new common_1.NotFoundException('Hospital not found');
        return this.hospitalRepo.addImages(hospitalId, uploadResults.map((r) => ({ imageUrl: r.url, isProfilePhoto: false })));
    }
    async deleteImage(hospitalId, imageId) {
        const image = await this.hospitalRepo.findImage(imageId);
        if (!image || image.hospitalId !== hospitalId) {
            throw new common_1.NotFoundException('Image not found or does not belong to this hospital');
        }
        return this.hospitalRepo.deleteImage(imageId);
    }
};
exports.HospitalService = HospitalService;
exports.HospitalService = HospitalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hospital_repository_1.HospitalRepository])
], HospitalService);
//# sourceMappingURL=hospital.service.js.map