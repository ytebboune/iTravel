import { Test, TestingModule } from '@nestjs/testing';
import { AuthLoggerService } from './auth-logger.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthLoggerService', () => {
  let service: AuthLoggerService;
  let prisma: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthLoggerService,
        {
          provide: PrismaService,
          useValue: {
            authLog: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthLoggerService>(AuthLoggerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('logAuthAttempt', () => {
    it('should log successful authentication attempt', async () => {
      const mockLog = {
        id: '1',
        userId: mockUser.id,
        email: mockUser.email,
        ipAddress: '192.168.1.1',
        userAgent: 'test-agent',
        success: true,
        reason: null,
        timestamp: new Date(),
      };

      jest.spyOn(prisma.authLog, 'create').mockResolvedValue(mockLog);

      await service.logAuthAttempt(
        mockUser.id,
        mockUser.email,
        '192.168.1.1',
        'test-agent',
        true,
      );

      expect(prisma.authLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUser.id,
          email: mockUser.email,
          ipAddress: '192.168.1.1',
          userAgent: 'test-agent',
          success: true,
        }),
      });
    });

    it('should log failed authentication attempt', async () => {
      const mockLog = {
        id: '1',
        userId: null,
        email: mockUser.email,
        ipAddress: '192.168.1.1',
        userAgent: 'test-agent',
        success: false,
        reason: null,
        timestamp: new Date(),
      };

      jest.spyOn(prisma.authLog, 'create').mockResolvedValue(mockLog);

      await service.logAuthAttempt(
        null,
        mockUser.email,
        '192.168.1.1',
        'test-agent',
        false,
      );

      expect(prisma.authLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: null,
          email: mockUser.email,
          ipAddress: '192.168.1.1',
          userAgent: 'test-agent',
          success: false,
        }),
      });
    });
  });

  describe('getRecentFailedAttempts', () => {
    it('should return count of recent failed attempts', async () => {
      jest.spyOn(prisma.authLog, 'count').mockResolvedValue(3);

      const result = await service.getRecentFailedAttempts(
        mockUser.email,
        '192.168.1.1',
      );

      expect(result).toBe(3);
      expect(prisma.authLog.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          OR: expect.any(Array),
          timestamp: expect.objectContaining({ gte: expect.any(Date) }),
        }),
      });
    });
  });
}); 