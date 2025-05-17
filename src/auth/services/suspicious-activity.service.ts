import { Injectable, Logger } from '@nestjs/common';
import { AuthLoggerService } from './auth-logger.service';

@Injectable()
export class SuspiciousActivityService {
  private readonly logger = new Logger(SuspiciousActivityService.name);
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly SUSPICIOUS_IPS = new Set<string>();
  private readonly SUSPICIOUS_EMAILS = new Set<string>();

  constructor(private readonly authLogger: AuthLoggerService) {}

  async checkSuspiciousActivity(email: string, ipAddress: string): Promise<{
    isSuspicious: boolean;
    reason?: string;
  }> {
    // Vérifier les tentatives récentes échouées
    const failedAttempts = await this.authLogger.getRecentFailedAttempts(email, ipAddress);

    if (failedAttempts >= this.MAX_FAILED_ATTEMPTS) {
      this.SUSPICIOUS_IPS.add(ipAddress);
      this.SUSPICIOUS_EMAILS.add(email);
      return {
        isSuspicious: true,
        reason: `Too many failed attempts (${failedAttempts}) in the last 15 minutes`,
      };
    }

    // Vérifier si l'IP ou l'email est déjà marqué comme suspect
    if (this.SUSPICIOUS_IPS.has(ipAddress)) {
      return {
        isSuspicious: true,
        reason: 'IP address has been flagged as suspicious',
      };
    }

    if (this.SUSPICIOUS_EMAILS.has(email)) {
      return {
        isSuspicious: true,
        reason: 'Email has been flagged as suspicious',
      };
    }

    return { isSuspicious: false };
  }

  async logSuspiciousActivity(
    email: string,
    ipAddress: string,
    reason: string,
  ) {
    this.logger.warn(
      `Suspicious activity detected - Email: ${email}, IP: ${ipAddress}, Reason: ${reason}`,
    );
    this.SUSPICIOUS_IPS.add(ipAddress);
    this.SUSPICIOUS_EMAILS.add(email);
  }

  async logFailedAttempt(email: string, ipAddress: string, reason: string) {
    this.logger.warn(
      `Failed attempt detected - Email: ${email}, IP: ${ipAddress}, Reason: ${reason}`,
    );
    this.SUSPICIOUS_IPS.add(ipAddress);
    this.SUSPICIOUS_EMAILS.add(email);
  }

  clearSuspiciousFlags(email?: string, ipAddress?: string) {
    if (email) {
      this.SUSPICIOUS_EMAILS.delete(email);
    }
    if (ipAddress) {
      this.SUSPICIOUS_IPS.delete(ipAddress);
    }
  }
} 