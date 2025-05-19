import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlValidator {
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
} 