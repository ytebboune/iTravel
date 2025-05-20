import { Injectable, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokenService } from './token.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { AppleAuthService } from './apple-auth.service';
import { UAParser } from 'ua-parser-js';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly appleAuthService: AppleAuthService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
    );
  }

  async register(registerDto: RegisterDto, userAgent: string) {
    const { email, username, password } = registerDto;

    // Vérifier si l'email ou le nom d'utilisateur existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        emailVerified: false,
        isPrivate: false,
      } satisfies Prisma.UserCreateInput,
      select: {
        id: true,
        email: true,
        username: true,
        emailVerified: true,
        avatar: true,
      },
    });

    // Générer le token de vérification
    const verificationToken = await this.tokenService.createVerificationToken(user.id);
    await this.emailService.sendVerificationEmail(email, verificationToken);

    // Générer les tokens d'authentification
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto, userAgent: string) {
    const { email, password } = loginDto;

    // Trouver l'utilisateur
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
      throw new UnauthorizedException('Invalid credentials');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Vérifier si c'est une nouvelle connexion
    const parser = new UAParser(userAgent);
    const deviceInfo = `${parser.getBrowser().name} on ${parser.getOS().name}`;
    
    // Envoyer une alerte si c'est une nouvelle connexion
    await this.emailService.sendNewLoginAlert(email, deviceInfo);

    // Générer les tokens d'authentification
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

  async verifyEmail(token: string) {
    const isValid = await this.tokenService.verifyEmailToken(token);
    
    if (!isValid) {
      throw new BadRequestException('Invalid or expired token');
    }

    return { message: 'Email verified successfully' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler que l'email n'existe pas
      return { message: 'If your email is registered, you will receive a password reset link' };
    }

    const resetToken = await this.tokenService.createPasswordResetToken(user.id);
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'If your email is registered, you will receive a password reset link' };
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this.tokenService.verifyPasswordResetToken(token);
    
    if (!userId) {
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword } satisfies Prisma.UserUpdateInput,
    });

    // Révoquer tous les tokens de rafraîchissement
    await this.tokenService.deleteAllUserRefreshTokens(userId);

    return { message: 'Password reset successfully' };
  }

  async refreshToken(refreshToken: string) {
    const userId = await this.tokenService.verifyRefreshToken(refreshToken);
    
    if (!userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Révoquer l'ancien token
    await this.tokenService.deleteRefreshToken(refreshToken);

    // Générer de nouveaux tokens
    const tokens = await this.generateTokens(user);

    return tokens;
  }

  async logout(refreshToken: string) {
    await this.tokenService.deleteRefreshToken(refreshToken);
    return { message: 'Logged out successfully' };
  }

  async logoutAllDevices(userId: string) {
    await this.tokenService.deleteAllUserRefreshTokens(userId);
    return { message: 'Logged out from all devices' };
  }

  private async generateTokens(user: Pick<User, 'id' | 'email' | 'username'>) {
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        username: user.username,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.tokenService.createRefreshToken(user.id, 'web');

    return { accessToken, refreshToken };
  }

  async googleAuth(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload?.email) {
        throw new BadRequestException('Invalid Google token');
      }

      const { email, name, picture } = payload;

      // Vérifier si l'utilisateur existe déjà
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
        // Créer un nouveau nom d'utilisateur basé sur l'email
        const username = email.split('@')[0];
        let uniqueUsername = username;
        let counter = 1;

        // S'assurer que le nom d'utilisateur est unique
        while (await this.prisma.user.findFirst({ 
          where: { username: uniqueUsername },
          select: { id: true },
        })) {
          uniqueUsername = `${username}${counter}`;
          counter++;
        }

        // Créer l'utilisateur
        user = await this.prisma.user.create({
          data: {
            email,
            username: uniqueUsername,
            password: '', // Mot de passe vide car authentification via Google
            emailVerified: true,
            avatar: picture,
            isPrivate: false,
          } satisfies Prisma.UserCreateInput,
          select: {
            id: true,
            email: true,
            username: true,
            emailVerified: true,
            avatar: true,
          },
        });
      }

      // Générer les tokens
      const tokens = await this.generateTokens(user);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new BadRequestException('Invalid Google token');
    }
  }

  async appleAuth(token: string) {
    try {
      const payload = await this.appleAuthService.verifyToken(token);
      const { email, name } = payload;

      // Vérifier si l'utilisateur existe déjà
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
        // Créer un nouveau nom d'utilisateur basé sur l'email
        const username = email.split('@')[0];
        let uniqueUsername = username;
        let counter = 1;

        // S'assurer que le nom d'utilisateur est unique
        while (await this.prisma.user.findUnique({ where: { username: uniqueUsername } })) {
          uniqueUsername = `${username}${counter}`;
          counter++;
        }

        // Créer l'utilisateur
        user = await this.prisma.user.create({
          data: {
            email,
            username: uniqueUsername,
            password: '', // Mot de passe vide car authentification via Apple
            emailVerified: true,
            isPrivate: false,
            bio: '',
            avatar: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          } satisfies Prisma.UserCreateInput,
          select: {
            id: true,
            email: true,
            username: true,
            emailVerified: true,
            avatar: true,
          },
        });
      }

      // Générer le token JWT
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
    } catch (error) {
      throw new BadRequestException('Invalid Apple token');
    }
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        sub: user.id,
        email: user.email,
        username: user.username,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload);
  }
}