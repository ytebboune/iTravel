import { Module, MiddlewareConsumer, RequestMethod, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TravelProjectModule } from './travel-project/travel-project.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { MonitoringMiddleware } from './monitoring/monitoring.middleware';
import { NotificationModule } from './notifications/notification.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60,
      limit: 100,
    }]),
    ConfigModule,
    PrismaModule,
    AuthModule,
    TravelProjectModule,
    MonitoringModule,
    NotificationModule,
  ],
  providers: [
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