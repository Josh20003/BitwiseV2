import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentService } from './assessment.service';
import { PrismaService } from 'prisma/prisma.service';
import { AdaptiveService } from '../adaptive/adaptive.service';
import { EmaMasteryService } from './ema-mastery.service';
import { LlmProviderService } from './llm-provider.service';

describe('AssessmentService', () => {
  let service: AssessmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentService,
        { provide: PrismaService, useValue: {} },
        { provide: AdaptiveService, useValue: {} },
        { provide: EmaMasteryService, useValue: {} },
        { provide: LlmProviderService, useValue: {} },
      ],
    }).compile();

    service = module.get<AssessmentService>(AssessmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
