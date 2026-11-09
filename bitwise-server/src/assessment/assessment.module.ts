import { Module } from '@nestjs/common';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { AdaptiveModule } from '../adaptive/adaptive.module';
import { AiQuizService } from './ai-quiz.service';
import { EmaMasteryService } from './ema-mastery.service';
import { LlmProviderService } from './llm-provider.service';

@Module({
  imports: [AdaptiveModule],
  controllers: [AssessmentController],
  providers: [
    AssessmentService,
    AiQuizService,
    EmaMasteryService,
    LlmProviderService,
  ],
  exports: [
    AssessmentService,
    AiQuizService,
    EmaMasteryService,
    LlmProviderService,
  ],
})
export class AssessmentModule { }
