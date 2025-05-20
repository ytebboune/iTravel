import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { randomBytes } from 'crypto';
import { Prisma, TokenType } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async createVerificationToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expire dans 24 heures

    await this.prisma.verificationToken.create({
      data: {
        token,
        type: TokenType.EMAIL_VERIFICATION,
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

  async createPasswordResetToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expire dans 1 heure

    await this.prisma.passwordResetToken.create({
      data: {
        token,
        type: TokenType.PASSWORD_RESET,
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

  async verifyEmailToken(token: string): Promise<boolean> {
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

  async verifyPasswordResetToken(token: string): Promise<string | null> {
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

  async deletePasswordResetToken(token: string): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: { token },
    });
  }

  async createRefreshToken(userId: string, device: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expire dans 30 jours

    await this.prisma.refreshToken.create({
      data: {
        token,
        type: TokenType.REFRESH,
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

  async verifyRefreshToken(token: string): Promise<string | null> {
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.userId;
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
} 