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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
const client_1 = require("@prisma/client");
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
    async createRefreshToken(userId, device) {
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
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
        });
        if (!refreshToken || refreshToken.expiresAt < new Date()) {
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
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], TokenService);
//# sourceMappingURL=token.service.js.map