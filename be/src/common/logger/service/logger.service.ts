import { Inject, Injectable, Scope } from '@nestjs/common';
import Logger, { LogData, LogLevel } from '../type/logger.type';
import { WinstonService } from './winston.service';
import { INQUIRER } from '@nestjs/core';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements Logger {
  private appName: string;
  private sourceClass: string;

  constructor(
    private winstonService: WinstonService,
    @Inject(INQUIRER) parentClass: Object,
  ) {
    this.sourceClass = parentClass?.constructor?.name;
    this.appName = 'TEst 123123';
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.winstonService.log(
      level,
      message,
      this.getLogData(data),
      profile,
    );
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.winstonService.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.winstonService.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.winstonService.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.winstonService.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.winstonService.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.winstonService.emergency(
      message,
      this.getLogData(data),
      profile,
    );
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      appName: data?.appName || this.appName,
      sourceClass: data?.sourceClass || this.sourceClass,
    };
  }

  public startProfile(id: string) {
    this.winstonService.startProfile(id);
  }
}
