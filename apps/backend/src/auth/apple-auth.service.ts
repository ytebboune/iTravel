import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class AppleAuthService {
  private readonly client: jwksClient.JwksClient;

  constructor(private readonly configService: ConfigService) {
    this.client = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
      cache: true,
      rateLimit: true,
    });
  }

  async verifyToken(token: string) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new BadRequestException('Invalid token format');
      }

      const key = await this.client.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();

      const verified = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
        audience: this.configService.get('APPLE_BUNDLE_ID'),
        issuer: 'https://appleid.apple.com',
      });

      if (typeof verified === 'string') {
        throw new BadRequestException('Invalid token payload');
      }

      return {
        email: verified.email,
        name: verified.name,
      };
    } catch (error) {
      throw new BadRequestException('Invalid Apple token');
    }
  }
} 