import { Module } from '@nestjs/common';
import { LodgingController } from './lodging.controller';
import { LodgingService } from './lodging.service';
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
  controllers: [LodgingController],
  providers: [LodgingService, UrlValidator],
  exports: [LodgingService],
})
export class LodgingModule {} 