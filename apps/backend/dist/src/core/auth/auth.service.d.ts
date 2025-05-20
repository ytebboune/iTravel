import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';
import { EmailService } from '../email/email.service';
import { AppleAuthService } from './apple-auth.service';
export declare class AuthService {
    private readonly configService;
    private readonly jwtService;
    private readonly prisma;
    private readonly appleAuthService;
    private readonly tokenService;
    private readonly emailService;
    private readonly googleClient;
    constructor(configService: ConfigService, jwtService: JwtService, prisma: PrismaService, appleAuthService: AppleAuthService, tokenService: TokenService, emailService: EmailService);
    register(registerDto: RegisterDto, userAgent: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            avatar: string;
            emailVerified: boolean;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto, userAgent: string): Promise<{
        user: {
            id: string;
            email: string;
            username: string;
            emailVerified: boolean;
            avatar: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        message: string;
    }>;
    logoutAllDevices(userId: string): Promise<{
        message: string;
    }>;
    private generateTokens;
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
    verifyToken(token: string): Promise<{
        sub: string;
        email: string;
        username: string;
    }>;
    private generateToken;
}
