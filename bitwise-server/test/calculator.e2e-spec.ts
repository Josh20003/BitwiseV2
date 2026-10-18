import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('CalculatorController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/calculator/convert (POST) - should convert decimal 255 to hex FF', () => {
        return request(app.getHttpServer())
            .post('/calculator/convert')
            .send({
                value: '255',
                fromBase: 10,
                toBase: 16
            })
            .expect(201)
            .expect((res) => {
                // Unwrapping the response object first
                expect(res.body.result.targetValue).toBe('FF');
            });
    });

    it('/calculator/arithmetic (POST) - should add 1010 and 0101', () => {
        return request(app.getHttpServer())
            .post('/calculator/arithmetic')
            .send({
                operand1: '1010',
                operand2: '0101',
                operation: '+'
            })
            .expect(201)
            .expect((res) => {
                // Unwrapping the response object first
                expect(res.body.result.result).toBe('1111');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});