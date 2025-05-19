import { Module } from '@nestjs/common';
import { TransportService } from './transport.service';
import { TransportController } from './transport.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationModule } from '../../../notifications/notification.module';
import { WebsocketModule } from '../../../websocket/websocket.module';
import { NotificationService } from '../../../notifications/notification.service';
import { UrlValidator } from '../../../utils/url-validator';
import { MonitoringService } from '../../../monitoring/monitoring.service';
import { AuthModule } from '../../../auth/auth.module';

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