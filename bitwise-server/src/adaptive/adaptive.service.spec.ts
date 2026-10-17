import { Test, TestingModule } from '@nestjs/testing';
import { AdaptiveService } from './adaptive.service';
import { PrismaService } from 'prisma/prisma.service';

describe('AdaptiveService', () => {
  let service: AdaptiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdaptiveService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AdaptiveService>(AdaptiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
