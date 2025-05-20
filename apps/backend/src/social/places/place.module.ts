import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { AuthModule } from 'src/core/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';
import { NotificationModule } from 'src/core/notifications/notification.module';

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule, WebsocketModule],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {} 