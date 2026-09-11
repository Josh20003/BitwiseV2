const { NestFactory } = require('@nestjs/core');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');
const { AppModule } = require('../dist/src/app.module');
const { ValidationPipe } = require('@nestjs/common');

const server = express();
let cachedApp;

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
    await bootstrap();
    server(req, res);
};
