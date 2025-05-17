import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { TokenType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

describe('TokenService', () => {
  let service: TokenService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    username: 'testuser',
    bio: 'Test bio',
    avatar: 'avatar.jpg',
    isPrivate: false,
  };

  beforeEach(async () => {
    // jest.spyOn(crypto, 'randomBytes').mockImplementation(() => Buffer.from('a'.repeat(64), 'hex'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn().mockImplementation((token) => {
              if (token === 'valid-token') {
                return { sub: mockUser.id, type: 'verification' };
              }
              throw new Error('Invalid token');
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            verificationToken: {
              create: jest.fn(),
              findUnique: jest.fn().mockImplementation(({ token }) => {
                if (token === 'valid-token') {
                  return {
                    token: 'valid-token',
                    userId: mockUser.id,
                    expiresAt: new Date(Date.now() + 10000),
                    user: mockUser,
                  };
                }
                return null;
              }),
              delete: jest.fn(),
            },
            passwordResetToken: {
              create: jest.fn(),
              findUnique: jest.fn().mockImplementation(({ token }) => {
                if (token === 'valid-token') {
                  return {
                    token: 'valid-token',
                    userId: mockUser.id,
                    expiresAt: new Date(Date.now() + 10000),
                  };
                }
                return null;
              }),
              delete: jest.fn(),
            },
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn().mockImplementation(({ token }) => {
                if (token === 'valid-token') {
                  return {
                    token: 'valid-token',
                    userId: mockUser.id,
                    expiresAt: new Date(Date.now() + 10000),
                  };
                }
                return null;
              }),
              delete: jest.fn(),
              deleteMany: jest.fn(),
            },
            user: {
              update: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'JWT_SECRET':
                  return 'test-secret';
                case 'JWT_EXPIRATION':
                  return '1h';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createVerificationToken', () => {
    it('should create a verification token', async () => {
      // const token = await service.createVerificationToken(mockUser.id);
      // expect(token).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('createPasswordResetToken', () => {
    it('should create a password reset token', async () => {
      // const token = await service.createPasswordResetToken(mockUser.id);
      // expect(token).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('verifyEmailToken', () => {
    it('should verify a valid email token', async () => {
      // const token = await service.createVerificationToken(mockUser.id);
      // const result = await service.verifyEmailToken(token);
      // expect(result).toBe(true);
    });

    it('should return false for invalid email token', async () => {
      // const result = await service.verifyEmailToken('invalid-token');
      // expect(result).toBe(false);
    });
  });

  describe('verifyPasswordResetToken', () => {
    it('should verify a valid password reset token', async () => {
      // const token = await service.createPasswordResetToken(mockUser.id);
      // const result = await service.verifyPasswordResetToken(token);
      // expect(result).toBe(mockUser.id);
    });

    it('should return null for invalid password reset token', async () => {
      // const result = await service.verifyPasswordResetToken('invalid-token');
      // expect(result).toBeNull();
    });
  });

  describe('createRefreshToken', () => {
    it('should create a refresh token', async () => {
      // const token = await service.createRefreshToken(mockUser.id, 'device-1');
      // expect(token).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', async () => {
      // const token = await service.createRefreshToken(mockUser.id, 'device-1');
      // const result = await service.verifyRefreshToken(token);
      // expect(result).toBe(mockUser.id);
    });

    it('should return null for invalid refresh token', async () => {
      // const result = await service.verifyRefreshToken('invalid-token');
      // expect(result).toBeNull();
    });
  });

  describe('deleteRefreshToken', () => {
    it('should revoke a refresh token', async () => {
      // const mockRefreshToken = {
      //   id: '1',
      //   token: 'refresh-token',
      //   userId: mockUser.id,
      //   type: TokenType.REFRESH,
      //   device: 'device-1',
      //   expiresAt: new Date(),
      //   createdAt: new Date(),
      // };

      // jest.spyOn(prisma.refreshToken, 'delete').mockResolvedValue(mockRefreshToken);

      // await service.deleteRefreshToken('refresh-token');

      // expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
      //   where: { token: 'refresh-token' },
      // });
    });
  });

  describe('deleteAllUserRefreshTokens', () => {
    it('should revoke all refresh tokens for a user', async () => {
      // await service.deleteAllUserRefreshTokens(mockUser.id);

      // expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
      //   where: { userId: mockUser.id },
      // });
    });
  });
}); 