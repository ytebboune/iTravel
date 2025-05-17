import { Module } from '@nestjs/common';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationModule } from '../../../notifications/notification.module';
import { MonitoringModule } from '../../../monitoring/monitoring.module';
import { WebsocketModule } from '../../../websocket/websocket.module';
import { UrlValidator } from '../../../utils/url-validator';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    MonitoringModule,
    WebsocketModule
  ],
  controllers: [TransportController],
  providers: [TransportService, UrlValidator],
  exports: [TransportService],
})
export class TransportModule {} 