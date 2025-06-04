import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';
import { EmailService } from '../email/email.service';
import { AppleAuthService } from './apple-auth.service';
import { User } from '@prisma/client';
interface TokenPayload {
    id: string;
    email: string;
    username: string;
    avatar: string;
    emailVerified: boolean;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        emailVerified: boolean;
        avatar: string | null;
    };
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    private readonly prisma;
    private readonly appleAuthService;
    private readonly tokenService;
    private readonly emailService;
    private readonly googleClient;
    private readonly MAX_ACTIVE_SESSIONS;
    constructor(configService: ConfigService, jwtService: JwtService, prisma: PrismaService, appleAuthService: AppleAuthService, tokenService: TokenService, emailService: EmailService);
    private generateAccessToken;
    private createRefreshToken;
    generateTokens(user: TokenPayload, device: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    register(registerDto: RegisterDto, userAgent: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string;
            emailVerified: boolean;
        };
    }>;
    login(loginDto: LoginDto, userAgent: string): Promise<AuthResponse>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string, userAgent: string): Promise<AuthResponse>;
    logout(refreshToken: string): Promise<void>;
    logoutAllDevices(userId: string): Promise<void>;
    getActiveSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        expiresAt: Date;
        device: string;
    }[]>;
    googleAuth(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string;
            emailVerified: boolean;
        };
    }>;
    appleAuth(token: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string;
        };
        token: string;
    }>;
    verifyToken(token: string): Promise<any>;
    private generateToken;
}
export {};
