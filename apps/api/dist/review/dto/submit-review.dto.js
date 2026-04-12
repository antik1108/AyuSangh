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
exports.ReplyToReviewDto = exports.RejectReviewDto = exports.ApproveReviewDto = exports.SubmitReviewDto = void 0;
const class_validator_1 = require("class-validator");
class SubmitReviewDto {
    rating;
    text;
    hospitalId;
    doctorId;
}
exports.SubmitReviewDto = SubmitReviewDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], SubmitReviewDto.prototype, "rating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "text", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "hospitalId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], SubmitReviewDto.prototype, "doctorId", void 0);
class ApproveReviewDto {
    reviewId;
}
exports.ApproveReviewDto = ApproveReviewDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ApproveReviewDto.prototype, "reviewId", void 0);
class RejectReviewDto {
    reviewId;
}
exports.RejectReviewDto = RejectReviewDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RejectReviewDto.prototype, "reviewId", void 0);
class ReplyToReviewDto {
    replyText;
}
exports.ReplyToReviewDto = ReplyToReviewDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReplyToReviewDto.prototype, "replyText", void 0);
//# sourceMappingURL=submit-review.dto.js.map