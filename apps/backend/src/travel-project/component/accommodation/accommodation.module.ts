import { Module } from '@nestjs/common';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../../auth/auth.module';
import { NotificationModule } from '../../../notifications/notification.module';
import { WebsocketModule } from '../../../websocket/websocket.module';
import { UrlValidator } from './utils/url-validator';

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule, WebsocketModule],
  controllers: [AccommodationController],
  providers: [AccommodationService, UrlValidator],
  exports: [AccommodationService],
})
export class AccommodationModule {} 