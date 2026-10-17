import { Test, TestingModule } from '@nestjs/testing';
import { AdaptiveController } from './adaptive.controller';
import { AdaptiveService } from './adaptive.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('AdaptiveController', () => {
  let controller: AdaptiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdaptiveController],
      providers: [
        {
          provide: AdaptiveService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AdaptiveController>(AdaptiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
