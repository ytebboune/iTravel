import { Controller, Post, Body, Get, UseGuards, Req, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthResponse> {
    try {
      return await this.authService.register(registerDto, userAgent);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Une erreur est survenue lors de l\'inscription',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthResponse> {
    try {
      return await this.authService.login(loginDto, userAgent);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Identifiants invalides',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Public()
  @Post('google')
  async googleAuth(@Body('token') token: string) {
    return this.authService.googleAuth(token);
  }

  @Public()
  @Post('apple')
  async appleAuth(@Body('token') token: string) {
    return this.authService.appleAuth(token);
  }

  @Public()
  @Get('verify-email/:token')
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('forgot-password')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Public()
  @Post('refresh')
  async refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<AuthResponse> {
    try {
      return await this.authService.refreshToken(refreshToken, userAgent);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Token de rafraîchissement invalide',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Body('refreshToken') refreshToken: string) {
    try {
      await this.authService.logout(refreshToken);
      return { message: 'Déconnexion réussie' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la déconnexion',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('logout-all')
  @UseGuards(AuthGuard)
  async logoutAllDevices(@Req() req) {
    try {
      await this.authService.logoutAllDevices(req.user.sub);
      return { message: 'Déconnexion de tous les appareils réussie' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la déconnexion',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req) {
    try {
      return req.user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la récupération du profil',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Get('verify')
  @UseGuards(AuthGuard)
  async verifyToken(@Req() req) {
    try {
      return { valid: true, user: req.user };
    } catch (error) {
      throw new HttpException(
        error.message || 'Token invalide',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}