import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('UserProgressController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // Override the guard to bypass auth and dynamically attach a mock user
            // so the @CurrentUser('id') decorator has a valid object to parse.
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = { id: 'test-user-123' };
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/progress/topic/:topicId/completed (POST) - should mark topic as completed', () => {
        return request(app.getHttpServer())
            .post('/progress/topic/1/completed')
            .expect(201);
    });

    it('/progress/lesson/:lessonId (GET) - should fetch lesson progress', () => {
        return request(app.getHttpServer())
            .get('/progress/lesson/1')
            .expect(200);
    });

    it('/progress/all (GET) - should fetch all user progress', () => {
        return request(app.getHttpServer())
            .get('/progress/all')
            .expect(200);
    });

    it('/progress/statistics (GET) - should fetch user statistics', () => {
        return request(app.getHttpServer())
            .get('/progress/statistics')
            .expect(200);
    });

    afterAll(async () => {
        await app.close();
    });
});