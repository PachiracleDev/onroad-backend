import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet from 'helmet';
import rawBodyMiddleware from './middleware/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
  });
  app.use(helmet());
  app.enableVersioning({
    defaultVersion: '1',
    type: 0, // ESTO ES PARA HABILITAR EL VERSIONAMIENTO DE TIPO URI (http://localhost:4000/v1)
  });

  app.use(rawBodyMiddleware());

  const externalDescription =
    'Hola bienvenido a la API de ONROAD, Espero les guste';

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true, // Si se envía un parámetro que no está definido en el DTO, se rechaza la petición
      whitelist: true, // Si se envía un parámetro que no está definido en el DTO, se ignora
    }),
  );

  const internalOptions = new DocumentBuilder()
    .setTitle('API - ONROAD')
    .setDescription(externalDescription)
    .addServer(configService.get('INTERNAL_API_URL'))
    .setVersion(configService.get('API_VERSION'))
    .addBearerAuth()
    .build();

  const internalDocument = SwaggerModule.createDocument(app, internalOptions);

  SwaggerModule.setup('/', app, internalDocument, {
    customCss:
      ".swagger-ui .topbar { background-color: #ffff } .topbar-wrapper img {content:url('https://onroadts.com/wp-content/uploads/2022/11/Logo-On-Road-Original-1024x370.png');}",
    customfavIcon:
      'https://onroadts.com/wp-content/uploads/2022/11/Logo-On-Road-Original-1024x370.png',
    customSiteTitle: 'API - ONROAD',
    swaggerOptions: {
      displayRequestDuration: true,
      persistAuthorization: true,
    },
  });
  await app.listen(configService.get('PORT'));
}
bootstrap();
