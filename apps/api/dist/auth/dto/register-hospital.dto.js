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
exports.RegisterHospitalDto = exports.LocationDto = exports.AdminUserDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class AdminUserDto {
    email;
    password;
    firstName;
    lastName;
}
exports.AdminUserDto = AdminUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Invalid admin email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Admin email is required' }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters' }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Admin first name is required' }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Admin last name is required' }),
    __metadata("design:type", String)
], AdminUserDto.prototype, "lastName", void 0);
class LocationDto {
    address;
    city;
    state;
    zipCode;
    country;
}
exports.LocationDto = LocationDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Address is required' }),
    __metadata("design:type", String)
], LocationDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'City is required' }),
    __metadata("design:type", String)
], LocationDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'State is required' }),
    __metadata("design:type", String)
], LocationDto.prototype, "state", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Zip code is required' }),
    __metadata("design:type", String)
], LocationDto.prototype, "zipCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Country is required' }),
    __metadata("design:type", String)
], LocationDto.prototype, "country", void 0);
class RegisterHospitalDto {
    name;
    description;
    admin;
    location;
}
exports.RegisterHospitalDto = RegisterHospitalDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Hospital name is required' }),
    __metadata("design:type", String)
], RegisterHospitalDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterHospitalDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AdminUserDto),
    __metadata("design:type", AdminUserDto)
], RegisterHospitalDto.prototype, "admin", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDto),
    __metadata("design:type", LocationDto)
], RegisterHospitalDto.prototype, "location", void 0);
//# sourceMappingURL=register-hospital.dto.js.map