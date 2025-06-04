import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class TokenService {
    private readonly jwtService;
    private readonly configService;
    private readonly prisma;
    constructor(jwtService: JwtService, configService: ConfigService, prisma: PrismaService);
    createVerificationToken(userId: string): Promise<string>;
    createPasswordResetToken(userId: string): Promise<string>;
    verifyEmailToken(token: string): Promise<boolean>;
    verifyPasswordResetToken(token: string): Promise<string | null>;
    deletePasswordResetToken(token: string): Promise<void>;
    createRefreshToken(userId: string, device: string, days?: number): Promise<string>;
    verifyRefreshToken(token: string): Promise<string | null>;
    deleteRefreshToken(token: string): Promise<void>;
    deleteAllUserRefreshTokens(userId: string): Promise<void>;
    deleteExpiredTokens(): Promise<void>;
}
