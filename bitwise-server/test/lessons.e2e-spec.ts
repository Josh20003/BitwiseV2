import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('LessonsController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/lessons (GET) - should fetch all lessons', () => {
        return request(app.getHttpServer())
            .get('/lessons')
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeDefined();
            });
    });

    it('/lessons (POST) - should create a new lesson', () => {
        return request(app.getHttpServer())
            .post('/lessons')
            .send({ title: 'E2E Test Lesson' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
            });
    });

    it('/lessons/:id/topics (GET) - should fetch topics for a specific lesson', () => {
        return request(app.getHttpServer())
            // Testing the dynamic route parameter parsing
            .get('/lessons/1/topics')
            .expect(200)
            .expect((res) => {
                expect(res.body).toBeDefined();
            });
    });

    it('/lessons/convert (POST) - should generate conversion steps', () => {
        return request(app.getHttpServer())
            .post('/lessons/convert')
            .send({ value: '10', fromBase: 10, toBase: 2 })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
            });
    });

    afterAll(async () => {
        await app.close();
    });
});