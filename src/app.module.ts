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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TravelProjectModule,
    MonitoringModule,
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