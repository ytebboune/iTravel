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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const token_service_1 = require("./token.service");
const email_service_1 = require("../email/email.service");
const bcrypt = __importStar(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const apple_auth_service_1 = require("./apple-auth.service");
const ua_parser_js_1 = require("ua-parser-js");
let AuthService = class AuthService {
    constructor(configService, jwtService, prisma, appleAuthService, tokenService, emailService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.appleAuthService = appleAuthService;
        this.tokenService = tokenService;
        this.emailService = emailService;
        this.googleClient = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'), this.configService.get('GOOGLE_CLIENT_SECRET'));
    }
    async register(registerDto, userAgent) {
        const { email, username, password } = registerDto;
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email or username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                emailVerified: false,
                isPrivate: false,
            },
            select: {
                id: true,
                email: true,
                username: true,
                emailVerified: true,
                avatar: true,
            },
        });
        const verificationToken = await this.tokenService.createVerificationToken(user.id);
        await this.emailService.sendVerificationEmail(email, verificationToken);
        const { accessToken, refreshToken } = await this.generateTokens(user);
        return {
            user,
            accessToken,
            refreshToken,
        };
    }
    async login(loginDto, userAgent) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                emailVerified: true,
                avatar: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const parser = new ua_parser_js_1.UAParser(userAgent);
        const deviceInfo = `${parser.getBrowser().name} on ${parser.getOS().name}`;
        await this.emailService.sendNewLoginAlert(email, deviceInfo);
        const { accessToken, refreshToken } = await this.generateTokens(user);
        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                emailVerified: user.emailVerified,
                avatar: user.avatar,
            },
            accessToken,
            refreshToken,
        };
    }
    async verifyEmail(token) {
        const isValid = await this.tokenService.verifyEmailToken(token);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        return { message: 'Email verified successfully' };
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return { message: 'If your email is registered, you will receive a password reset link' };
        }
        const resetToken = await this.tokenService.createPasswordResetToken(user.id);
        await this.emailService.sendPasswordResetEmail(email, resetToken);
        return { message: 'If your email is registered, you will receive a password reset link' };
    }
    async resetPassword(token, newPassword) {
        const userId = await this.tokenService.verifyPasswordResetToken(token);
        if (!userId) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        await this.tokenService.deleteAllUserRefreshTokens(userId);
        return { message: 'Password reset successfully' };
    }
    async refreshToken(refreshToken) {
        const userId = await this.tokenService.verifyRefreshToken(refreshToken);
        if (!userId) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.tokenService.deleteRefreshToken(refreshToken);
        const tokens = await this.generateTokens(user);
        return tokens;
    }
    async logout(refreshToken) {
        await this.tokenService.deleteRefreshToken(refreshToken);
        return { message: 'Logged out successfully' };
    }
    async logoutAllDevices(userId) {
        await this.tokenService.deleteAllUserRefreshTokens(userId);
        return { message: 'Logged out from all devices' };
    }
    async generateTokens(user) {
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            username: user.username,
        }, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '15m',
        });
        const refreshToken = await this.tokenService.createRefreshToken(user.id, 'web');
        return { accessToken, refreshToken };
    }
    async googleAuth(token) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken: token,
                audience: this.configService.get('GOOGLE_CLIENT_ID'),
            });
            const payload = ticket.getPayload();
            if (!payload?.email) {
                throw new common_1.BadRequestException('Invalid Google token');
            }
            const { email, name, picture } = payload;
            let user = await this.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    emailVerified: true,
                    avatar: true,
                },
            });
            if (!user) {
                const username = email.split('@')[0];
                let uniqueUsername = username;
                let counter = 1;
                while (await this.prisma.user.findFirst({
                    where: { username: uniqueUsername },
                    select: { id: true },
                })) {
                    uniqueUsername = `${username}${counter}`;
                    counter++;
                }
                user = await this.prisma.user.create({
                    data: {
                        email,
                        username: uniqueUsername,
                        password: '',
                        emailVerified: true,
                        avatar: picture,
                        isPrivate: false,
                    },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        emailVerified: true,
                        avatar: true,
                    },
                });
            }
            const tokens = await this.generateTokens(user);
            return {
                user,
                ...tokens,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid Google token');
        }
    }
    async appleAuth(token) {
        try {
            const payload = await this.appleAuthService.verifyToken(token);
            const { email, name } = payload;
            let user = await this.prisma.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    emailVerified: true,
                    avatar: true,
                },
            });
            if (!user) {
                const username = email.split('@')[0];
                let uniqueUsername = username;
                let counter = 1;
                while (await this.prisma.user.findUnique({ where: { username: uniqueUsername } })) {
                    uniqueUsername = `${username}${counter}`;
                    counter++;
                }
                user = await this.prisma.user.create({
                    data: {
                        email,
                        username: uniqueUsername,
                        password: '',
                        emailVerified: true,
                        isPrivate: false,
                        bio: '',
                        avatar: '',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        emailVerified: true,
                        avatar: true,
                    },
                });
            }
            const jwtToken = this.generateToken(user);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    avatar: user.avatar,
                },
                token: jwtToken,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid Apple token');
        }
    }
    async verifyToken(token) {
        try {
            const decoded = this.jwtService.verify(token);
            const user = await this.prisma.user.findUnique({
                where: { id: decoded.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return {
                sub: user.id,
                email: user.email,
                username: user.username,
            };
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    generateToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        apple_auth_service_1.AppleAuthService,
        token_service_1.TokenService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map