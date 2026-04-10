"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRatingStrategy = void 0;
const common_1 = require("@nestjs/common");
let DefaultRatingStrategy = class DefaultRatingStrategy {
    calculateScore(reviews) {
        if (!reviews || reviews.length === 0)
            return 0;
        const total = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        return Math.round((total / reviews.length) * 10) / 10;
    }
};
exports.DefaultRatingStrategy = DefaultRatingStrategy;
exports.DefaultRatingStrategy = DefaultRatingStrategy = __decorate([
    (0, common_1.Injectable)()
], DefaultRatingStrategy);
//# sourceMappingURL=default-rating.strategy.js.map