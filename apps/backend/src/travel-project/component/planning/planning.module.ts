import { Module } from '@nestjs/common';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';
import { PrismaModule } from '../../../prisma/prisma.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';
import { AuthModule } from 'src/core/auth/auth.module';
import { NotificationModule } from 'src/core/notifications/notification.module';

@Module({
  imports: [PrismaModule, AuthModule, NotificationModule, WebsocketModule],
  controllers: [PlanningController],
  providers: [PlanningService],
  exports: [PlanningService],
})
export class PlanningModule {} 