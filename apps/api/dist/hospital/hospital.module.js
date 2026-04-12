"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalModule = void 0;
const common_1 = require("@nestjs/common");
const hospital_service_1 = require("./hospital.service");
const hospital_controller_1 = require("./hospital.controller");
const hospital_repository_1 = require("./hospital.repository");
const favourites_service_1 = require("./favourites.service");
const database_module_1 = require("../database/database.module");
const cloudinary_service_1 = require("../common/services/cloudinary.service");
const institutions_controller_1 = require("./institutions.controller");
let HospitalModule = class HospitalModule {
};
exports.HospitalModule = HospitalModule;
exports.HospitalModule = HospitalModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [hospital_controller_1.HospitalController, institutions_controller_1.InstitutionsController],
        providers: [hospital_service_1.HospitalService, hospital_repository_1.HospitalRepository, favourites_service_1.FavouritesService, cloudinary_service_1.CloudinaryService],
        exports: [hospital_service_1.HospitalService, favourites_service_1.FavouritesService],
    })
], HospitalModule);
//# sourceMappingURL=hospital.module.js.map