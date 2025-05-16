import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationService } from 'src/notifications/notification.service';
import { UrlValidator } from 'src/utils/url-validator';
import { MonitoringService } from 'src/monitoring/monitoring.service';

@Module({
  imports: [PrismaModule],
  controllers: [TransportController],
  providers: [TransportService, NotificationService, UrlValidator, MonitoringService],
  exports: [TransportService],
})
export class TransportModule {} 