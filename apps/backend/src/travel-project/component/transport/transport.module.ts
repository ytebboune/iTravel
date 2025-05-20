import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationModule } from 'src/core/notifications/notification.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';
import { NotificationService } from 'src/core/notifications/notification.service';
import { UrlValidator } from 'src/core/utils/url-validator';
import { MonitoringService } from 'src/core/monitoring/monitoring.service';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    WebsocketModule,
    AuthModule,
  ],
  controllers: [TransportController],
  providers: [TransportService, NotificationService, UrlValidator, MonitoringService],
  exports: [TransportService],
})
export class TransportModule {} 