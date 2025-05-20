import { Module, MiddlewareConsumer, RequestMethod, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TravelProjectModule } from './travel-project/travel-project.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './core/auth/auth.module';
import { MonitoringModule } from './core/monitoring/monitoring.module';
import { MonitoringMiddleware } from './core/monitoring/monitoring.middleware';
import { NotificationService } from './core/notifications/notification.service';
import { NotificationModule } from './core/notifications/notification.module';
import { UrlValidator } from './core/utils/url-validator';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { MonitoringService } from './core/monitoring/monitoring.service';
import { TransportModule } from './travel-project/component/transport/transport.module';
import { DestinationModule } from './travel-project/component/destination/destination.module';
import { ActivityModule } from './travel-project/component/activity/activity.module';
import { DateSuggestionModule } from './travel-project/component/date-suggestion/date-suggestion.module';
import { StoryModule } from './social/stories/story.module';
import { PostModule } from './social/posts/post.module';
import { PlaceModule } from './social/places/place.module';
import { SettingsModule } from './settings/settings.module';
import { UserModule } from './users/user.module';
import { UploadModule } from './core/upload/upload.module';
import { EmailModule } from './core/email/email.module';
import { ChatModule } from './social/chat/chat.module';
import { AiModule } from './core/ai/ai.module';

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