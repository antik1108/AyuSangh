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
exports.InstitutionsController = void 0;
const common_1 = require("@nestjs/common");
const hospital_service_1 = require("./hospital.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const create_institution_dto_1 = require("./dto/create-institution.dto");
const update_institution_dto_1 = require("./dto/update-institution.dto");
let InstitutionsController = class InstitutionsController {
    hospitalService;
    constructor(hospitalService) {
        this.hospitalService = hospitalService;
    }
    listInstitutions(name, city, type, minRating) {
        return this.hospitalService.listInstitutions({
            name,
            city,
            type,
            minRating: typeof minRating !== 'undefined' ? Number(minRating) : undefined,
        });
    }
    getInstitution(id) {
        return this.hospitalService.getInstitutionById(id);
    }
    createInstitution(req, data) {
        return this.hospitalService.createInstitution(req.user.userId, data);
    }
    updateInstitution(id, data) {
        return this.hospitalService.updateInstitution(id, data);
    }
};
exports.InstitutionsController = InstitutionsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Query)('city')),
    __param(2, (0, common_1.Query)('type')),
    __param(3, (0, common_1.Query)('minRating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], InstitutionsController.prototype, "listInstitutions", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstitutionsController.prototype, "getInstitution", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PLATFORM_ADMIN),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_institution_dto_1.CreateInstitutionDto]),
    __metadata("design:returntype", void 0)
], InstitutionsController.prototype, "createInstitution", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.HOSPITAL_ADMIN, client_1.Role.PLATFORM_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_institution_dto_1.UpdateInstitutionDto]),
    __metadata("design:returntype", void 0)
], InstitutionsController.prototype, "updateInstitution", null);
exports.InstitutionsController = InstitutionsController = __decorate([
    (0, common_1.Controller)('institutions'),
    __metadata("design:paramtypes", [hospital_service_1.HospitalService])
], InstitutionsController);
//# sourceMappingURL=institutions.controller.js.map