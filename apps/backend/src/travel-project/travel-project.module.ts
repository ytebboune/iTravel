import { Module } from '@nestjs/common';
import { TravelProjectService } from './travel-project.service';
import { TravelProjectController } from './travel-project.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [TravelProjectService],
  controllers: [TravelProjectController],
})
export class TravelProjectModule {}
