import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            // Override the guard to not only bypass auth, but dynamically attach a mock user 
            // to the request so the @CurrentUser() decorator has data to parse.
            .overrideGuard(JwtAuthGuard)
            .useValue({
                canActivate: (context) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = {
                        id: 'test-user-123',
                        email: 'test@bitwise.edu',
                        user_metadata: { role: 'student' }
                    };
                    return true;
                },
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/auth/signup (POST) - should route to signup service', () => {
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: 'new@bitwise.edu', password: 'password123' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
            });
    });

    it('/auth/signin (POST) - should route to signin service', () => {
        return request(app.getHttpServer())
            .post('/auth/signin')
            .send({ email: 'test@bitwise.edu', password: 'password123' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toBeDefined();
            });
    });

    it('/auth/profile (GET) - should return protected profile data', () => {
        return request(app.getHttpServer())
            .get('/auth/profile')
            .expect(200)
            .expect((res) => {
                // Verifying our mock user data was successfully extracted by @CurrentUser()
                expect(res.body.id).toEqual('test-user-123');
                expect(res.body.email).toEqual('test@bitwise.edu');
            });
    });

    it('/auth/verify (POST) - should verify token and return user validity', () => {
        return request(app.getHttpServer())
            .post('/auth/verify')
            .expect(201)
            .expect((res) => {
                expect(res.body.valid).toBe(true);
                expect(res.body.user.id).toEqual('test-user-123');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});