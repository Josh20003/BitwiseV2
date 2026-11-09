const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const { AppModule } = require('../dist/src/app.module');
const { ValidationPipe } = require('@nestjs/common');

const server = express();
let cachedApp;
let bootstrapPromise;

async function bootstrap() {
    if (cachedApp) return cachedApp;

    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
        logger: ['error', 'warn', 'log'],
    });

    const globalPrefix = process.env.GLOBAL_PREFIX || 'api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    app.enableCors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    });

    await app.init();
    cachedApp = app;
    return app;
}

module.exports = async function handler(req, res) {
    // Concurrent cold-start requests share a single initialization and pool.
    if (!bootstrapPromise) {
        bootstrapPromise = bootstrap().catch(error => {
            bootstrapPromise = undefined;
            throw error;
        });
    }
    await bootstrapPromise;
    server(req, res);
};
