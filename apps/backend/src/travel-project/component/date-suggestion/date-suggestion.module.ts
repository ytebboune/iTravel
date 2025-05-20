import { Module } from '@nestjs/common';
import { DateSuggestionController } from './date-suggestion.controller';
import { DateSuggestionService } from './date-suggestion.service';
import { NotificationService } from 'src/core/notifications/notification.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WebsocketModule } from 'src/core/websocket/websocket.module';
import { NotificationModule } from 'src/core/notifications/notification.module';
import { AuthModule } from 'src/core/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    WebsocketModule,
    AuthModule,
  ],
  controllers: [DateSuggestionController],
  providers: [DateSuggestionService, NotificationService],
  exports: [DateSuggestionService],
})
export class DateSuggestionModule {} 