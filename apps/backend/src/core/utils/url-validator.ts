import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlValidator {
  private readonly allowedDomains = {
    transport: ['skyscanner', 'trainline', 'ouigo', 'sncf-connect'],
    accommodation: ['airbnb', 'booking', 'hotels'],
  };

  validateUrl(url: string, type: 'transport' | 'accommodation'): boolean {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      return this.allowedDomains[type].some(
        allowedDomain => domain.includes(allowedDomain)
      );
    } catch {
      return false;
    }
  }

  getDomainType(url: string): 'transport' | 'accommodation' | null {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      if (this.allowedDomains.transport.some(d => domain.includes(d))) {
        return 'transport';
      }
      if (this.allowedDomains.accommodation.some(d => domain.includes(d))) {
        return 'accommodation';
      }
      return null;
    } catch {
      return null;
    }
  }
} 