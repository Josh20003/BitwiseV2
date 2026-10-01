import { Module } from '@nestjs/common';
import { AiModule } from './ai/ai.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { CalculatorModule } from './calculator/calculator.module';
import { LessonsModule } from './lessons/lessons.module';
import { AssessmentModule } from './assessment/assessment.module';
import { PrismaModule } from 'prisma/prisma.module';
import { AdaptiveModule } from './adaptive/adaptive.module';
import { UserProgressModule } from './user-progress/user-progress.module';
import { ExamplesModule } from './examples/examples.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    CalculatorModule,
    LessonsModule,
    AssessmentModule,
    PrismaModule,
    AdaptiveModule,
    UserProgressModule,
    ExamplesModule,
    AiModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
