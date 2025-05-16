import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('metrics')
  getMetrics(@Res() res: Response) {
    res.set('Content-Type', 'text/plain');
    res.send(this.monitoringService.getMetricsText());
  }

  @Get('health')
  getHealth() {
    const metrics = this.monitoringService.getMetrics();
    return {
      status: 'ok',
      uptime: metrics.uptime,
      timestamp: new Date().toISOString(),
    };
  }
} 