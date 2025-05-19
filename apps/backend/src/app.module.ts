import { Module, MiddlewareConsumer, RequestMethod, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TravelProjectModule } from './travel-project/travel-project.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { MonitoringMiddleware } from './monitoring/monitoring.middleware';
import { NotificationService } from './notifications/notification.service';
import { UrlValidator } from './utils/url-validator';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { MonitoringService } from './monitoring/monitoring.service';
import { TransportModule } from './travel-project/component/transport/transport.module';
import { DestinationModule } from './travel-project/component/destination/destination.module';
import { ActivityModule } from './travel-project/component/activity/activity.module';
import { DateSuggestionModule } from './travel-project/component/date-suggestion/date-suggestion.module';
import { StoryModule } from './stories/story.module';
import { PostModule } from './posts/post.module';
import { PlaceModule } from './places/place.module';
import { SettingsModule } from './settings/settings.module';
import { VoteModule } from './vote/vote.module';
import { UserModule } from './users/user.module';
import { UploadModule } from './upload/upload.module';
import { NotificationModule } from './notifications/notification.module';
import { EmailModule } from './email/email.module';
import { ChatModule } from './chat/chat.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TravelProjectModule,
    MonitoringModule,
    TransportModule,
    DestinationModule,
    ActivityModule,
    DateSuggestionModule,
    StoryModule,
    PostModule,
    PlaceModule,
    SettingsModule,
    VoteModule,
    UserModule,
    UploadModule,
    NotificationModule,
    EmailModule,
    ChatModule,
    AiModule,
  ],
  providers: [
    NotificationService,
    UrlValidator,
    MonitoringService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  configure(consumer: MiddlewareConsumer) {
    this.logger.log('Configuring application middleware...');
    consumer
      .apply(MonitoringMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
    this.logger.log('Middleware configuration completed');
  }
}