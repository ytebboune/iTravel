import { Module } from '@nestjs/common';
import { TravelProjectService } from './travel-project.service';
import { TravelProjectController } from './travel-project.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AccommodationModule } from './component/accommodation/accommodation.module';
import { PlanningModule } from './component/planning/planning.module';

@Module({
  imports: [PrismaModule, AuthModule, AccommodationModule, PlanningModule],
  providers: [TravelProjectService],
  controllers: [TravelProjectController],
})
export class TravelProjectModule {}
