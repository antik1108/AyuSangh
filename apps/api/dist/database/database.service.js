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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let DatabaseService = class DatabaseService {
    prismaClient;
    constructor() {
        this.prismaClient = new client_1.PrismaClient();
    }
    async onModuleInit() {
        await this.prismaClient.$connect();
    }
    async onModuleDestroy() {
        await this.prismaClient.$disconnect();
    }
    get client() {
        return this.prismaClient;
    }
    get user() {
        return this.prismaClient.user;
    }
    get hospital() {
        return this.prismaClient.hospital;
    }
    get doctor() {
        return this.prismaClient.doctor;
    }
    get review() {
        return this.prismaClient.review;
    }
    get refreshToken() {
        return this.prismaClient.refreshToken;
    }
    get favourite() {
        return this.prismaClient.favourite;
    }
    get institutionImage() {
        return this.prismaClient.institutionImage;
    }
    get location() {
        return this.prismaClient.location;
    }
    get communityPost() {
        return this.prismaClient.communityPost;
    }
    get cost() {
        return this.prismaClient.cost;
    }
    get accreditation() {
        return this.prismaClient.accreditation;
    }
    get $queryRaw() {
        return this.prismaClient.$queryRaw.bind(this.prismaClient);
    }
    get $transaction() {
        return this.prismaClient.$transaction.bind(this.prismaClient);
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
//# sourceMappingURL=database.service.js.map