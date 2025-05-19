import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationModule } from '../../../notifications/notification.module';
import { WebsocketModule } from '../../../websocket/websocket.module';
import { NotificationService } from '../../../notifications/notification.service';
import { AuthModule } from '../../../auth/auth.module';

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