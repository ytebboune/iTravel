import { Module } from '@nestjs/common';
import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';

import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';
import { NotificationModule } from 'src/core/notifications/notification.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { NotificationService } from 'src/core/notifications/notification.service';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    WebsocketModule,
    AuthModule,
  ],
  controllers: [DestinationController],
  providers: [DestinationService, NotificationService],
  exports: [DestinationService],
})
export class DestinationModule {} 