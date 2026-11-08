import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentService } from './assessment.service';
import { PrismaService } from '../../prisma/prisma.service';
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

describe('Lesson quiz provider failure recovery', () => {
  const topics = [
    { id: 21, title: 'Binary ↔ Decimal', contentText: '', tags: [] },
    { id: 22, title: 'Binary ↔ Hex', contentText: '', tags: [] },
    { id: 23, title: 'Digit Groupings', contentText: '', tags: [] },
  ];
  const setup = (response: () => Promise<string>) => {
    const create = jest.fn().mockResolvedValue({ id: 42 });
    const service = new AssessmentService(
      { lesson: { findUnique: jest.fn().mockResolvedValue({ id: 2, title: 'Types of Number Systems', topics }) }, userSkill: { findMany: jest.fn().mockResolvedValue([]) }, attempt: { create } } as any,
      { initializeUserSkills: jest.fn().mockResolvedValue(undefined) } as any,
      {} as any,
      { generateStrict: jest.fn().mockImplementation(response) } as any,
    );
    return { service, create };
  };

  it.each(['provider error', 'invalid JSON', 'empty array'])(
    'saves ten usable, topic-mapped questions after %s', async (failure) => {
      const { service, create } = setup(async () => {
        if (failure === 'provider error') throw new Error('provider unavailable');
        return failure === 'invalid JSON' ? 'invalid' : '[]';
      });
      const result = await service.startLessonPracticeAttempt('test-user', 2);
      expect(result.generationSource).toBe('built-in');
      expect(result.questions).toHaveLength(10);
      expect(create).toHaveBeenCalledTimes(1);
      expect(result.questions.filter(q => q.topicId === 21)).toHaveLength(4);
      for (const q of result.questions) {
        expect(q.lessonId).toBe(2);
        expect(topics.map(t => t.id)).toContain(q.topicId);
        expect(new Set(q.options.map(o => o.text)).size).toBe(4);
        expect(q.options.filter(o => o.isCorrect)).toHaveLength(1);
        expect(q.options.find(o => o.id === q.answerId)?.isCorrect).toBe(true);
        expect(q.stem).not.toContain('[Fallback]');
      }
    },
  );
});
