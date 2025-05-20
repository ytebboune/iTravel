import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { NotificationModule } from 'src/core/notifications/notification.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule, WebsocketModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {} 