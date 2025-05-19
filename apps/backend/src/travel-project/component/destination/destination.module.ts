import { Module } from '@nestjs/common';
import { DestinationController } from './destination.controller';
import { DestinationService } from './destination.service';
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
  controllers: [DestinationController],
  providers: [DestinationService, NotificationService],
  exports: [DestinationService],
})
export class DestinationModule {} 