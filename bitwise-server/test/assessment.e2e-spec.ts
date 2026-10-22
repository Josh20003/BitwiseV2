import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

// Increase Jest timeout to 30 seconds for heavy database/algorithm tasks
jest.setTimeout(30000);

describe('AssessmentController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(JwtAuthGuard)
            .useValue({ canActivate: () => true })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/assessment/start-adaptive-practice (POST) - should route practice initialization', () => {
        return request(app.getHttpServer())
            .post('/assessment/start-adaptive-practice')
            .send({ uid: 'test-user-123' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.success).toBeDefined();
            });
    });

    it('/assessment/history/:userId (GET) - should fetch user assessment history', () => {
        return request(app.getHttpServer())
            .get('/assessment/history/test-user-123')
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.success).toBeDefined();
            });
    });

    it('/assessment/ai-quiz/submit (POST) - should submit LLM generated quiz score', () => {
        return request(app.getHttpServer())
            .post('/assessment/ai-quiz/submit')
            .send({
                userId: 'test-user-123',
                topic: 'Boolean Algebra',
                score: 90,
                answersJson: { q1: "A", q2: "B" }
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
                expect(res.body.success).toBeDefined();
            });
    });

    afterAll(async () => {
        await app.close();
    });
});