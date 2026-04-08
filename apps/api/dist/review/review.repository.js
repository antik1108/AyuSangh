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
exports.ReviewRepository = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../common/repositories/base.repository");
const client_1 = require("@prisma/client");
const database_service_1 = require("../database/database.service");
let ReviewRepository = class ReviewRepository extends base_repository_1.BaseRepository {
    prisma;
    constructor(prisma) {
        super(prisma.review);
        this.prisma = prisma;
    }
    async findByHospital(hospitalId) {
        return this.prisma.review.findMany({
            where: { hospitalId },
            include: { author: { select: { id: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByDoctor(doctorId) {
        return this.prisma.review.findMany({
            where: { doctorId },
            include: { author: { select: { id: true, firstName: true, lastName: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findFirstByAuthorAndEntity(authorId, hospitalId, doctorId) {
        return this.prisma.review.findFirst({
            where: {
                authorId,
                hospitalId: hospitalId ?? undefined,
                doctorId: doctorId ?? undefined,
            },
        });
    }
    async updateStatus(reviewId, status) {
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { status },
        });
    }
    async updateContent(reviewId, updates) {
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { ...updates, status: client_1.ReviewStatus.PENDING },
        });
    }
    async addAdminReply(reviewId, replyText) {
        return this.prisma.review.update({
            where: { id: reviewId },
            data: { adminReply: replyText, adminReplyAt: new Date() },
        });
    }
    async findPending() {
        return this.prisma.review.findMany({
            where: { status: client_1.ReviewStatus.PENDING },
            include: {
                author: { select: { id: true, email: true, firstName: true, lastName: true } },
                hospital: { select: { id: true, name: true } },
                doctor: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], ReviewRepository);
//# sourceMappingURL=review.repository.js.map