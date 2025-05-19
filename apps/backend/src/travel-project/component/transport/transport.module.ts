import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationService } from '../../../notifications/notification.service';
import { UrlValidator } from '../../../utils/url-validator';
import { MonitoringService } from '../../../monitoring/monitoring.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransportController],
  providers: [TransportService, NotificationService, UrlValidator, MonitoringService],
  exports: [TransportService],
})
export class TransportModule {} 