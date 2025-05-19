import { Module } from '@nestjs/common';
import { DateSuggestionService } from './date-suggestion.service';
import { DateSuggestionController } from './date-suggestion.controller';
import { PrismaModule } from '../../../prisma/prisma.module';
import { NotificationModule } from '../../../notifications/notification.module';
import { WebsocketModule } from '../../../websocket/websocket.module';

@Module({
  imports: [PrismaModule, NotificationModule, WebsocketModule],
  controllers: [DateSuggestionController],
  providers: [DateSuggestionService],
  exports: [DateSuggestionService],
})
export class DateSuggestionModule {} 