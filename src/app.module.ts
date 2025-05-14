import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TravelProjectModule } from './travel-project/travel-project.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';
import { VoteModule } from './vote/vote.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    TravelProjectModule,
    ChatModule,
    VoteModule,
    AiModule,
    UploadModule,
  ],
})
export class AppModule {}