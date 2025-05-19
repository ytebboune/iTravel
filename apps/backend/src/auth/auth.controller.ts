import { Controller, Post, Body, Get, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.register(registerDto, userAgent);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.login(loginDto, userAgent);
  }

  @Post('google')
  async googleAuth(@Body('token') token: string) {
    return this.authService.googleAuth(token);
  }

  @Post('apple')
  async appleAuth(@Body('token') token: string) {
    return this.authService.appleAuth(token);
  }

  @Get('verify-email/:token')
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  async requestPasswordReset(@Body('email') email: string) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(token, newPassword);
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Body('refreshToken') refreshToken: string) {
    return this.authService.logout(refreshToken);
  }

  @Post('logout-all')
  @UseGuards(AuthGuard)
  async logoutAllDevices(@Req() req) {
    return this.authService.logoutAllDevices(req.user.sub);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Req() req) {
    return req.user;
  }
}