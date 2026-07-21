import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Client } from 'pg';

import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { buildValidationOptions } from '@utils/helpers';
import { AllExceptionsFilter } from '@utils/exceptions';

async function createDatabaseIfNotExists() {
  const dbName = process.env.DB_NAME;

  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!) || 5432,
    database: 'postgres',
  });

  await client.connect();

  try {
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.info(`ℹ️  La base de datos '${dbName}' fue creada correctamente`);
    } else {
      console.info(`ℹ️  La base de datos '${dbName}' ya existe, no es necesario crearla`);
    }
  } catch (error) {
    console.error('Error al verificar/crear la base de datos:', error);
  } finally {
    await client.end();
  }
}

export function setupValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe(buildValidationOptions()));
}

export function setupBullBoard(app: INestApplication, queues: string[]) {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const adapters = queues.map((queueName) => {
    const queue = app.get<Queue>(getQueueToken(queueName));
    return new BullMQAdapter(queue);
  });

  createBullBoard({
    queues: adapters,
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());
}

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API DOCUMENTATION')
    .setDescription('App Description')
    .setVersion('3')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  await createDatabaseIfNotExists();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new AllExceptionsFilter());

  app.setGlobalPrefix('api/v1');

  app.useStaticAssets(join(process.cwd(), 'public'));

  app.set('trust proxy', true);

  setupValidationPipe(app);

  setupSwagger(app);

  setupBullBoard(app, ['email']);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
