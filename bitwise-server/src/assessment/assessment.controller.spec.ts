import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { AdaptiveService } from '../adaptive/adaptive.service';
import { AiQuizService } from './ai-quiz.service';
import { EmaMasteryService } from './ema-mastery.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('AssessmentController', () => {
  let controller: AssessmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentController],
      providers: [
        { provide: AssessmentService, useValue: {} },
        { provide: AdaptiveService, useValue: {} },
        { provide: AiQuizService, useValue: {} },
        { provide: EmaMasteryService, useValue: {} },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AssessmentController>(AssessmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
