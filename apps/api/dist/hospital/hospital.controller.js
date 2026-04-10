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
exports.HospitalController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const hospital_service_1 = require("./hospital.service");
const favourites_service_1 = require("./favourites.service");
const cloudinary_service_1 = require("../common/services/cloudinary.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const register_hospital_dto_1 = require("../auth/dto/register-hospital.dto");
let HospitalController = class HospitalController {
    hospitalService;
    favouritesService;
    cloudinaryService;
    constructor(hospitalService, favouritesService, cloudinaryService) {
        this.hospitalService = hospitalService;
        this.favouritesService = favouritesService;
        this.cloudinaryService = cloudinaryService;
    }
    searchHospitals(name, city) {
        return this.hospitalService.search(name, city);
    }
    async getUserFavourites(req) {
        return this.favouritesService.getUserFavourites(req.user.userId);
    }
    async getMyHospital(req) {
        return this.hospitalService.findHospitalByAdmin(req.user.userId);
    }
    getHospital(id) {
        return this.hospitalService.getProfile(id);
    }
    registerHospital(data) {
        return this.hospitalService.registerHospital(data);
    }
    async uploadProfilePhoto(req, hospitalId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No file provided');
        }
        const uploadResult = await this.cloudinaryService.uploadImage(file, 'institutions');
        await this.hospitalService.updateProfilePhoto(hospitalId, uploadResult.url);
        return {
            message: 'Profile photo uploaded successfully',
            photoUrl: uploadResult.url,
            ...uploadResult,
        };
    }
    async uploadMultipleImages(req, hospitalId, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files provided');
        }
        const uploadResults = await this.cloudinaryService.uploadImages(files, 'institutions');
        await this.hospitalService.addImages(hospitalId, uploadResults);
        return {
            message: `${uploadResults.length} images uploaded successfully`,
            images: uploadResults,
        };
    }
    async deleteImage(hospitalId, imageId) {
        await this.hospitalService.deleteImage(hospitalId, imageId);
        return { message: 'Image deleted successfully' };
    }
    async addToFavourites(req, hospitalId) {
        return this.favouritesService.addToFavourites(req.user.userId, hospitalId);
    }
    async removeFromFavourites(req, hospitalId) {
        await this.favouritesService.removeFromFavourites(req.user.userId, hospitalId);
        return { message: 'Removed from favourites' };
    }
    async isFavourite(req, hospitalId) {
        const isFav = await this.favouritesService.isFavourite(req.user.userId, hospitalId);
        return { isFavourite: isFav };
    }
};
exports.HospitalController = HospitalController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HospitalController.prototype, "searchHospitals", null);
__decorate([
    (0, common_1.Get)('user/favourites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "getUserFavourites", null);
__decorate([
    (0, common_1.Get)('admin/mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "getMyHospital", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HospitalController.prototype, "getHospital", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.PLATFORM_ADMIN, client_1.Role.HOSPITAL_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_hospital_dto_1.RegisterHospitalDto]),
    __metadata("design:returntype", void 0)
], HospitalController.prototype, "registerHospital", null);
__decorate([
    (0, common_1.Post)(':hospitalId/upload-photo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PLATFORM_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        fileFilter: (req, file, cb) => {
            const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedMimes.includes(file.mimetype)) {
                cb(new common_1.BadRequestException('Only JPEG, PNG, and WebP files are allowed'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('hospitalId')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "uploadProfilePhoto", null);
__decorate([
    (0, common_1.Post)(':hospitalId/upload-images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PLATFORM_ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        fileFilter: (req, file, cb) => {
            const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedMimes.includes(file.mimetype)) {
                cb(new common_1.BadRequestException('Only JPEG, PNG, and WebP files are allowed'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('hospitalId')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "uploadMultipleImages", null);
__decorate([
    (0, common_1.Delete)(':hospitalId/images/:imageId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PLATFORM_ADMIN),
    __param(0, (0, common_1.Param)('hospitalId')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Post)(':hospitalId/favourite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('hospitalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "addToFavourites", null);
__decorate([
    (0, common_1.Delete)(':hospitalId/favourite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('hospitalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "removeFromFavourites", null);
__decorate([
    (0, common_1.Get)(':hospitalId/is-favourite'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('hospitalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], HospitalController.prototype, "isFavourite", null);
exports.HospitalController = HospitalController = __decorate([
    (0, common_1.Controller)('hospitals'),
    __metadata("design:paramtypes", [hospital_service_1.HospitalService,
        favourites_service_1.FavouritesService,
        cloudinary_service_1.CloudinaryService])
], HospitalController);
//# sourceMappingURL=hospital.controller.js.map