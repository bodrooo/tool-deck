import { Module } from '@nestjs/common';
import { WinstonService } from './service/winston.service';
import { LoggerService } from './service/logger.service';
import LoggerWrapService from './service/logger-wrap.service';
import Logger from './type/logger.type';

@Module({
  providers: [
    WinstonService,
    LoggerService,
    {
      provide: LoggerWrapService,
      useFactory: (logger: Logger) => new LoggerWrapService(logger),
      inject: [LoggerService],
    },
  ],
  exports: [LoggerWrapService, LoggerService],
})
export class LoggerModule {}
