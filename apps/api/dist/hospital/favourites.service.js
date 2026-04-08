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
exports.FavouritesService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let FavouritesService = class FavouritesService {
    databaseService;
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async addToFavourites(userId, hospitalId) {
        return this.databaseService.favourite.create({
            data: { userId, hospitalId },
        });
    }
    async removeFromFavourites(userId, hospitalId) {
        await this.databaseService.favourite.deleteMany({
            where: { userId, hospitalId },
        });
    }
    async getUserFavourites(userId) {
        return this.databaseService.favourite.findMany({
            where: { userId },
            include: {
                hospital: {
                    include: {
                        location: true,
                        reviews: true,
                    },
                },
            },
            orderBy: { addedAt: 'desc' },
        });
    }
    async isFavourite(userId, hospitalId) {
        const favourite = await this.databaseService.favourite.findUnique({
            where: {
                userId_hospitalId: { userId, hospitalId },
            },
        });
        return !!favourite;
    }
    async getFavouriteCount(hospitalId) {
        return this.databaseService.favourite.count({
            where: { hospitalId },
        });
    }
};
exports.FavouritesService = FavouritesService;
exports.FavouritesService = FavouritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], FavouritesService);
//# sourceMappingURL=favourites.service.js.map