import { Module } from '@nestjs/common';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';
import { NotificationModule } from 'src/core/notifications/notification.module';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule, WebsocketModule],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {} 