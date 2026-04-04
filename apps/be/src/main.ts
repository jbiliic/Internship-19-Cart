import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AllExceptionsFilter } from './common/filters/exception.filter';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    });
    app.setGlobalPrefix('api');

    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
    }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());

    const config = new DocumentBuilder()
        .setTitle('E-commerce API')
        .setDescription('API for managing products, orders, and users in an e-commerce application')
        .setVersion('1.0')
        .addTag('e-commerce')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
