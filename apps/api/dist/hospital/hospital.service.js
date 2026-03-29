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
const database_service_1 = require("../database/database.service");
let HospitalService = class HospitalService {
    hospitalRepo;
    prisma;
    constructor(hospitalRepo, prisma) {
        this.hospitalRepo = hospitalRepo;
        this.prisma = prisma;
    }
    async search(name, city) {
        return this.hospitalRepo.searchHospitals(name, city);
    }
    getRepo() {
        return this.hospitalRepo;
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
                    country: data.country
                }
            }
        });
    }
    async updateProfilePhoto(hospitalId, photoUrl) {
        const hospital = await this.prisma.hospital.findUnique({
            where: { id: hospitalId },
        });
        if (!hospital) {
            throw new common_1.NotFoundException('Hospital not found');
        }
        return this.prisma.hospital.update({
            where: { id: hospitalId },
            data: { profilePhoto: photoUrl },
        });
    }
    async addImages(hospitalId, uploadResults) {
        const hospital = await this.prisma.hospital.findUnique({
            where: { id: hospitalId },
        });
        if (!hospital) {
            throw new common_1.NotFoundException('Hospital not found');
        }
        const images = uploadResults.map((result) => ({
            imageUrl: result.url,
            hospitalId: hospitalId,
            isProfilePhoto: false,
        }));
        const createdImages = await Promise.all(images.map((image) => this.prisma.institutionImage.create({
            data: image,
        })));
        return createdImages;
    }
    async deleteImage(hospitalId, imageId) {
        const image = await this.prisma.institutionImage.findUnique({
            where: { id: imageId },
        });
        if (!image || image.hospitalId !== hospitalId) {
            throw new common_1.NotFoundException('Image not found or does not belong to this hospital');
        }
        return this.prisma.institutionImage.delete({
            where: { id: imageId },
        });
    }
};
exports.HospitalService = HospitalService;
exports.HospitalService = HospitalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hospital_repository_1.HospitalRepository,
        database_service_1.DatabaseService])
], HospitalService);
//# sourceMappingURL=hospital.service.js.map