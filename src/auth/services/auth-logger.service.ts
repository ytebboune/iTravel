import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthLoggerService {
  private readonly logger = new Logger(AuthLoggerService.name);

  constructor(private prisma: PrismaService) {}

  async logAuthAttempt(
    userId: string | null,
    email: string,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    reason?: string,
  ) {
    try {
      await this.prisma.authLog.create({
        data: {
          userId,
          email,
          ipAddress,
          userAgent,
          success,
          reason,
          timestamp: new Date(),
        },
      });

      if (!success) {
        this.logger.warn(
          `Failed authentication attempt for ${email} from ${ipAddress}. Reason: ${reason}`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to log authentication attempt', error);
    }
  }

  async getRecentFailedAttempts(email: string, ipAddress: string, timeWindow: number = 15) {
    const cutoffTime = new Date(Date.now() - timeWindow * 60 * 1000);
    
    return this.prisma.authLog.count({
      where: {
        OR: [
          { email, success: false },
          { ipAddress, success: false },
        ],
        timestamp: {
          gte: cutoffTime,
        },
      },
    });
  }
} 