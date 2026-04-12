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
        return this.prisma.hospital.findUnique({
            where: { id },
            include: {
                location: true,
                departments: true,
                images: true,
                doctors: {
                    include: {
                        doctor: true,
                    },
                },
            },
        });
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
    async findHospitalByAdmin(adminUserId) {
        const hospital = await this.prisma.hospital.findFirst({
            where: { adminId: adminUserId },
            include: {
                location: true,
                departments: true,
                images: true,
                reviews: { select: { rating: true, status: true } },
            },
        });
        if (!hospital) {
            throw new common_1.NotFoundException('No hospital found for this administrator');
        }
        return hospital;
    }
    async listInstitutions(params) {
        const { name, city, type, minRating } = params;
        return this.prisma.hospital.findMany({
            where: {
                ...(name
                    ? {
                        name: {
                            contains: name,
                            mode: 'insensitive',
                        },
                    }
                    : {}),
                ...(city
                    ? {
                        location: {
                            city: {
                                contains: city,
                                mode: 'insensitive',
                            },
                        },
                    }
                    : {}),
                ...(type ? { institutionType: type } : {}),
                ...(typeof minRating === 'number' ? { rating: { gte: minRating } } : {}),
            },
            include: {
                location: true,
                departments: true,
                images: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getInstitutionById(id) {
        const institution = await this.prisma.hospital.findUnique({
            where: { id },
            include: {
                location: true,
                departments: true,
                images: true,
                doctors: {
                    include: {
                        doctor: true,
                    },
                },
                reviews: {
                    where: { status: 'APPROVED' },
                    include: {
                        author: {
                            select: { id: true, firstName: true, lastName: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!institution) {
            throw new common_1.NotFoundException('Institution not found');
        }
        return institution;
    }
    async createInstitution(adminUserId, data) {
        const location = await this.prisma.location.create({
            data: {
                address: data.location.address,
                city: data.location.city,
                state: data.location.state,
                zipCode: data.location.pincode,
                country: data.location.country,
            },
        });
        const institution = await this.prisma.hospital.create({
            data: {
                name: data.name,
                description: data.description,
                institutionType: data.type,
                adminId: adminUserId,
                phone: data.phone,
                website: data.bookingLink,
                locationId: location.id,
            },
        });
        if (data.services?.length) {
            await this.prisma.department.createMany({
                data: data.services.map((serviceName) => ({
                    hospitalId: institution.id,
                    name: serviceName,
                })),
            });
        }
        if (data.photos?.length) {
            await this.prisma.institutionImage.createMany({
                data: data.photos.map((photoUrl, idx) => ({
                    hospitalId: institution.id,
                    imageUrl: photoUrl,
                    isProfilePhoto: idx === 0,
                })),
            });
        }
        return this.getInstitutionById(institution.id);
    }
    async updateInstitution(id, data) {
        const existing = await this.prisma.hospital.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Institution not found');
        }
        await this.prisma.hospital.update({
            where: { id },
            data: {
                ...(data.name ? { name: data.name } : {}),
                ...(typeof data.description !== 'undefined'
                    ? { description: data.description }
                    : {}),
                ...(data.type ? { institutionType: data.type } : {}),
                ...(typeof data.phone !== 'undefined' ? { phone: data.phone } : {}),
                ...(typeof data.bookingLink !== 'undefined'
                    ? { website: data.bookingLink }
                    : {}),
            },
        });
        if (data.location) {
            await this.prisma.location.update({
                where: { id: existing.locationId },
                data: {
                    ...(data.location.address ? { address: data.location.address } : {}),
                    ...(data.location.city ? { city: data.location.city } : {}),
                    ...(data.location.state ? { state: data.location.state } : {}),
                    ...(data.location.pincode ? { zipCode: data.location.pincode } : {}),
                    ...(data.location.country ? { country: data.location.country } : {}),
                },
            });
        }
        if (data.services) {
            await this.prisma.department.deleteMany({ where: { hospitalId: id } });
            if (data.services.length > 0) {
                await this.prisma.department.createMany({
                    data: data.services.map((serviceName) => ({
                        hospitalId: id,
                        name: serviceName,
                    })),
                });
            }
        }
        if (data.photos) {
            await this.prisma.institutionImage.deleteMany({ where: { hospitalId: id } });
            if (data.photos.length > 0) {
                await this.prisma.institutionImage.createMany({
                    data: data.photos.map((photoUrl, idx) => ({
                        hospitalId: id,
                        imageUrl: photoUrl,
                        isProfilePhoto: idx === 0,
                    })),
                });
            }
        }
        return this.getInstitutionById(id);
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