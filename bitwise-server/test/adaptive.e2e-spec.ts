import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('AdaptiveController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // This overrides your JWT guard so the test can pass through without logging in
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/adaptive/skills/:userId (GET) - should fetch user skills', () => {
    return request(app.getHttpServer())
      // Firing a GET request to your actual route with a mock user ID
      .get('/adaptive/skills/test-user-123')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        // Your controller always returns { success: boolean, ... }
        expect(res.body.success).toBeDefined();
      });
  });

  it('/adaptive/recommendations/:userId (GET) - should fetch adaptive recommendations', () => {
    return request(app.getHttpServer())
      // Firing a GET request to your actual route with a mock user ID
      .get('/adaptive/recommendations/test-user-123')
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.success).toBeDefined();
      });
  });

  afterAll(async () => {
    await app.close();
  });
});