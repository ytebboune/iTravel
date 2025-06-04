import { Injectable, UnauthorizedException, ConflictException, BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
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
import { User, Prisma, TokenType } from '@prisma/client';
import * as crypto from 'crypto';

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

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  private readonly MAX_ACTIVE_SESSIONS = 5; // Nombre maximum de sessions actives par utilisateur

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

  private async generateAccessToken(user: TokenPayload): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m', // Access token expire après 15 minutes
    });
  }

  private async createRefreshToken(userId: string, device: string): Promise<string> {
    // Vérifier le nombre de sessions actives
    const activeSessions = await this.prisma.refreshToken.count({
      where: {
        userId,
        type: TokenType.REFRESH,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    // Si l'utilisateur a atteint la limite de sessions, supprimer la plus ancienne
    if (activeSessions >= this.MAX_ACTIVE_SESSIONS) {
      const oldestSession = await this.prisma.refreshToken.findFirst({
        where: {
          userId,
          type: TokenType.REFRESH,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (oldestSession) {
        await this.prisma.refreshToken.delete({
          where: { id: oldestSession.id },
        });
      }
    }

    // Créer un nouveau refresh token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire après 7 jours

    await this.prisma.refreshToken.create({
      data: {
        token,
        type: TokenType.REFRESH,
        user: {
          connect: { id: userId },
        },
        device,
        expiresAt,
      },
    });

    return token;
  }

  async generateTokens(user: TokenPayload, device: string): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.createRefreshToken(user.id, device),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({ 
        where: { email },
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error validating user:', error);
      throw new InternalServerErrorException('Erreur lors de la validation des identifiants');
    }
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
    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      avatar: user.avatar || '',
    }, userAgent);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto, userAgent: string): Promise<AuthResponse> {
    try {
      const { email, password } = loginDto;

      const user = await this.validateUser(email, password);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Analyser le user agent pour identifier l'appareil
      const parser = new UAParser(userAgent);
      const deviceInfo = `${parser.getBrowser().name} on ${parser.getOS().name}`;
      
      // Envoyer une alerte si c'est une nouvelle connexion
      await this.emailService.sendNewLoginAlert(email, deviceInfo);

      // Générer les tokens
      const tokens = await this.generateTokens({
        id: user.id,
        email: user.email,
        username: user.username,
        emailVerified: user.emailVerified,
        avatar: user.avatar || '',
      }, deviceInfo);

      return {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified,
          avatar: user.avatar,
        },
        ...tokens,
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Une erreur est survenue lors de la connexion');
    }
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

  async refreshToken(refreshToken: string, userAgent: string): Promise<AuthResponse> {
    // Vérifier le refresh token dans la base de données
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date() || storedToken.type !== TokenType.REFRESH) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Analyser le user agent
    const parser = new UAParser(userAgent);
    const deviceInfo = `${parser.getBrowser().name} on ${parser.getOS().name}`;

    // Générer de nouveaux tokens
    const tokens = await this.generateTokens({
      id: storedToken.user.id,
      email: storedToken.user.email,
      username: storedToken.user.username,
      emailVerified: storedToken.user.emailVerified,
      avatar: storedToken.user.avatar || '',
    }, deviceInfo);

    // Supprimer l'ancien refresh token
    await this.prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    return {
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        username: storedToken.user.username,
        emailVerified: storedToken.user.emailVerified,
        avatar: storedToken.user.avatar,
      },
      ...tokens,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token: refreshToken },
    });
  }

  async logoutAllDevices(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
        type: TokenType.REFRESH,
      },
    });
  }

  async getActiveSessions(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        type: TokenType.REFRESH,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        device: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
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
      const tokens = await this.generateTokens(user, 'Google');

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
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      return payload;
    } catch (error) {
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