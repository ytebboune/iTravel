import { Test, TestingModule } from '@nestjs/testing';
import { SuspiciousActivityService } from './suspicious-activity.service';
import { AuthLoggerService } from './auth-logger.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('SuspiciousActivityService', () => {
  let service: SuspiciousActivityService;
  let prisma: any;
  let authLogger: AuthLoggerService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
  };

  const mockSuspiciousActivity = {
    id: '1',
    email: 'test@example.com',
    ipAddress: '192.168.1.1',
    type: 'Failed login attempt',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuspiciousActivityService,
        {
          provide: PrismaService,
          useValue: {
            suspiciousActivity: {
              findMany: jest.fn(),
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: AuthLoggerService,
          useValue: {
            getRecentFailedAttempts: jest.fn(),
          },
        },
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    service = module.get<SuspiciousActivityService>(SuspiciousActivityService);
    authLogger = module.get<AuthLoggerService>(AuthLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkSuspiciousActivity', () => {
    it('should return false if no suspicious activity found', async () => {
      const result = await service.checkSuspiciousActivity('test@example.com', '192.168.1.1');
      expect(result).toEqual({ isSuspicious: false });
    });

    it('should return true if suspicious activity found', async () => {
      await service.logFailedAttempt('test@example.com', '192.168.1.1', 'Failed login attempt');
      const result = await service.checkSuspiciousActivity('test@example.com', '192.168.1.1');
      expect(result).toEqual({ isSuspicious: true, reason: 'IP address has been flagged as suspicious' });
    });
  });

  describe('logFailedAttempt', () => {
    it('should log failed attempt', async () => {
      await service.logFailedAttempt('test@example.com', '192.168.1.1', 'Failed login attempt');
      const result = await service.checkSuspiciousActivity('test@example.com', '192.168.1.1');
      expect(result).toEqual({ isSuspicious: true, reason: 'IP address has been flagged as suspicious' });
    });
  });

  describe('clearSuspiciousFlags', () => {
    it('should clear flags for email', async () => {
      await service.logFailedAttempt('test@example.com', '192.168.1.1', 'Failed login attempt');
      service.clearSuspiciousFlags('test@example.com');
      const result = await service.checkSuspiciousActivity('test@example.com', '192.168.1.1');
      expect(result).toEqual({ isSuspicious: true, reason: 'IP address has been flagged as suspicious' });
    });

    it('should clear flags for IP address', async () => {
      await service.logFailedAttempt('test@example.com', '192.168.1.1', 'Failed login attempt');
      service.clearSuspiciousFlags(null, '192.168.1.1');
      const result = await service.checkSuspiciousActivity('test@example.com', '192.168.1.1');
      expect(result).toEqual({ isSuspicious: true, reason: 'Email has been flagged as suspicious' });
    });

    it('should clear flags for both email and IP address', async () => {
      await service.logFailedAttempt('test@example.com', '192.168.1.1', 'Failed login attempt');
      service.clearSuspiciousFlags('test@example.com', '192.168.1.1');
      const result = await service.checkSuspiciousActivity('test@example.com', '192.168.1.1');
      expect(result).toEqual({ isSuspicious: false });
    });
  });
}); 