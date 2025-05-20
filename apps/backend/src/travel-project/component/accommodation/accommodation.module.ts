import { Module } from '@nestjs/common';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { UrlValidator } from './utils/url-validator';
import { AuthModule } from 'src/core/auth/auth.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';
import { NotificationModule } from 'src/core/notifications/notification.module';

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule, WebsocketModule],
  controllers: [AccommodationController],
  providers: [AccommodationService, UrlValidator],
  exports: [AccommodationService],
})
export class AccommodationModule {} 