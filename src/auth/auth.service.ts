import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded || typeof decoded === 'string') {
        throw new UnauthorizedException('Token invalid');
      }
      return decoded;
    } catch {
      throw new UnauthorizedException('Token malformed');
    }
  }
}