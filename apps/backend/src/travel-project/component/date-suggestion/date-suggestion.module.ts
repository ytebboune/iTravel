import { Module } from '@nestjs/common';
import { DateSuggestionController } from './date-suggestion.controller';
import { DateSuggestionService } from './date-suggestion.service';
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
  controllers: [DateSuggestionController],
  providers: [DateSuggestionService, NotificationService],
  exports: [DateSuggestionService],
})
export class DateSuggestionModule {} 