import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import LoggerWrapService from './common/logger/service/logger-wrap.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(await app.get(LoggerWrapService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
