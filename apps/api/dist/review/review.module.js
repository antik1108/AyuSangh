"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModule = void 0;
const common_1 = require("@nestjs/common");
const review_service_1 = require("./review.service");
const review_controller_1 = require("./review.controller");
const review_repository_1 = require("./review.repository");
const default_rating_strategy_1 = require("./strategies/default-rating.strategy");
const hospital_rating_strategy_1 = require("./strategies/hospital-rating.strategy");
const lab_rating_strategy_1 = require("./strategies/lab-rating.strategy");
const rating_context_1 = require("./rating.context");
const database_module_1 = require("../database/database.module");
const hospital_module_1 = require("../hospital/hospital.module");
let ReviewModule = class ReviewModule {
};
exports.ReviewModule = ReviewModule;
exports.ReviewModule = ReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, hospital_module_1.HospitalModule],
        controllers: [review_controller_1.ReviewController],
        providers: [
            review_service_1.ReviewService,
            review_repository_1.ReviewRepository,
            default_rating_strategy_1.DefaultRatingStrategy,
            hospital_rating_strategy_1.HospitalRatingStrategy,
            lab_rating_strategy_1.LabRatingStrategy,
            rating_context_1.RatingContext,
        ],
        exports: [review_service_1.ReviewService],
    })
], ReviewModule);
//# sourceMappingURL=review.module.js.map