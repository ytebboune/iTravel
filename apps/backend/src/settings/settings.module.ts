import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from 'src/core/notifications/notification.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule, WebsocketModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {} 