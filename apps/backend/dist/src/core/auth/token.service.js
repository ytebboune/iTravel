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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let TokenService = class TokenService {
    constructor(jwtService, configService, prisma) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
    async createVerificationToken(userId) {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        await this.prisma.verificationToken.create({
            data: {
                token,
                type: client_1.TokenType.EMAIL_VERIFICATION,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                expiresAt,
            },
        });
        return token;
    }
    async createPasswordResetToken(userId) {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await this.prisma.passwordResetToken.create({
            data: {
                token,
                type: client_1.TokenType.PASSWORD_RESET,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                expiresAt,
            },
        });
        return token;
    }
    async verifyEmailToken(token) {
        const verificationToken = await this.prisma.verificationToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!verificationToken || verificationToken.expiresAt < new Date()) {
            return false;
        }
        await this.prisma.user.update({
            where: { id: verificationToken.userId },
            data: { emailVerified: true },
        });
        await this.prisma.verificationToken.delete({
            where: { token },
        });
        return true;
    }
    async verifyPasswordResetToken(token) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token },
        });
        if (!resetToken || resetToken.expiresAt < new Date()) {
            return null;
        }
        await this.prisma.passwordResetToken.delete({
            where: { token },
        });
        return resetToken.userId;
    }
    async deletePasswordResetToken(token) {
        await this.prisma.passwordResetToken.delete({
            where: { token },
        });
    }
    async createRefreshToken(userId, device, days = 7) {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
        await this.prisma.refreshToken.create({
            data: {
                token,
                type: client_1.TokenType.REFRESH,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                device,
                expiresAt,
            },
        });
        return token;
    }
    async verifyRefreshToken(token) {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: {
                user: true,
            },
        });
        if (!refreshToken || refreshToken.expiresAt < new Date() || refreshToken.type !== client_1.TokenType.REFRESH) {
            return null;
        }
        return refreshToken.userId;
    }
    async deleteRefreshToken(token) {
        await this.prisma.refreshToken.delete({
            where: { token },
        });
    }
    async deleteAllUserRefreshTokens(userId) {
        await this.prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }
    async deleteExpiredTokens() {
        await this.prisma.refreshToken.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], TokenService);
//# sourceMappingURL=token.service.js.map