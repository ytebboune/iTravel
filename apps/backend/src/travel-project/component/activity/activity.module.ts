import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

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
  controllers: [ActivityController],
  providers: [ActivityService, NotificationService],
  exports: [ActivityService],
})
export class ActivityModule {} 