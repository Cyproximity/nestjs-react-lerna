import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ZodValidationPipe, patchNestjsSwagger } from '@anatine/zod-nestjs';

import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

const PORT = 1433;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());

  const documentBuilderConfig = new DocumentBuilder()
    .setTitle('Login and Bookmark')
    .setDescription('Login and bookmark app')
    .setVersion('1.0.0')
    .addTag('bookmarks')
    .addTag('auth')
    .build();

  patchNestjsSwagger();

  const document = SwaggerModule.createDocument(app, documentBuilderConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    Logger.log(`Listening at http://localhost:${PORT}/`);
  });

  // tell prisma to gracefully exit
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}
bootstrap();
