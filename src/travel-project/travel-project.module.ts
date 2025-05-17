import { Module } from '@nestjs/common';
import { TravelProjectService } from './travel-project.service';
import { TravelProjectController } from './travel-project.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { LodgingModule } from './component/lodging/lodging.module';
import { ActivityModule } from './component/activity/activity.module';
import { AccommodationModule } from './component/accommodation/accommodation.module';
import { DateSuggestionModule } from './component/date-suggestion/date-suggestion.module';
import { PlanningModule } from './component/planning/planning.module';
import { DestinationModule } from './component/destination/destination.module';
import { TransportModule } from './component/transport/transport.module';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NotificationModule,
    LodgingModule,
    ActivityModule,
    AccommodationModule,
    DateSuggestionModule,
    PlanningModule,
    DestinationModule,
    TransportModule
  ],
  providers: [TravelProjectService],
  controllers: [TravelProjectController],
})
export class TravelProjectModule {}
