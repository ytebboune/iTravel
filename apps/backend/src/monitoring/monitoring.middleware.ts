import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringMiddleware implements NestMiddleware {
  constructor(private readonly monitoringService: MonitoringService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Incrémenter le compteur de requêtes
    this.monitoringService.incrementRequestCount();

    // Intercepter la fin de la réponse
    res.on('finish', () => {
      const duration = Date.now() - start;
      
      // Enregistrer le temps de réponse
      this.monitoringService.recordResponseTime(duration);

      // Incrémenter le compteur d'erreurs si nécessaire
      if (res.statusCode >= 400) {
        this.monitoringService.incrementErrorCount();
      }
    });

    next();
  }
} 