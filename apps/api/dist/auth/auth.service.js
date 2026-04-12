"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const database_service_1 = require("../database/database.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    databaseService;
    accessTokenExpiry = '8h';
    refreshTokenExpiry = '7d';
    constructor(usersService, jwtService, databaseService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.databaseService = databaseService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findOneByEmail(email);
        if (user && (await bcrypt.compare(pass, user.passwordHash))) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.accessTokenExpiry,
        });
        const refreshToken = this._generateRandomToken();
        const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await this.databaseService.refreshToken.create({
            data: {
                token: refreshToken,
                userEmail: user.email,
                expiresAt: refreshTokenExpiresAt,
            },
        });
        await this.databaseService.user.update({
            where: { id: user.id },
            data: {
                refreshTokenExpiresAt: refreshTokenExpiresAt,
            },
        });
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: '8h',
            token_type: 'Bearer',
            user,
        };
    }
    async refreshAccessToken(refreshToken) {
        const tokenRecord = await this.databaseService.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!tokenRecord ||
            tokenRecord.expiresAt < new Date() ||
            tokenRecord.revokedAt !== null) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = await this.usersService.findOneByEmail(tokenRecord.userEmail);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        const newAccessToken = this.jwtService.sign(payload, {
            expiresIn: this.accessTokenExpiry,
        });
        return {
            access_token: newAccessToken,
            refresh_token: refreshToken,
            expires_in: '8h',
            token_type: 'Bearer',
        };
    }
    async logout(refreshToken) {
        await this.databaseService.refreshToken.update({
            where: { token: refreshToken },
            data: { revokedAt: new Date() },
        });
    }
    async validateRefreshToken(refreshToken) {
        const tokenRecord = await this.databaseService.refreshToken.findUnique({
            where: { token: refreshToken },
        });
        if (!tokenRecord) {
            throw new common_1.UnauthorizedException('Refresh token not found');
        }
        if (tokenRecord.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        if (tokenRecord.revokedAt !== null) {
            throw new common_1.UnauthorizedException('Refresh token has been revoked');
        }
        return tokenRecord;
    }
    async registerUser(data) {
        return this.usersService.createPatient(data);
    }
    async registerHospital(data) {
        return this.usersService.createHospitalAdmin(data);
    }
    async registerDoctor(data) {
        return this.usersService.createDoctor(data);
    }
    _generateRandomToken() {
        return crypto.randomBytes(32).toString('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, database_service_1.DatabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map