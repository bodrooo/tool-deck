import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import Logger, { LogData, LogLevel } from '../type/logger.type';

export const WINSTON_SERVICE = Symbol();

@Injectable()
export class WinstonService implements Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(this.getWinstonOptions());
  }

  private getTransport() {
    return [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.printf((log: any) => {
            const prefix = `${log.data?.label ? `[${log.data.label}]` : ''}`;
            return `${prefix} - ${log.timestamp} |${
              log.data?.correlationId ? `(${log.data.correlationId})` : ''
            } ${log.level.toUpperCase()} ${
              log.data?.sourceClass ? `[${log.data.sourceClass}]` : ''
            } ${log.message}${log.data?.error ? ' - ' + log.data.error : ''}${
              log.data?.durationMs !== undefined
                ? ' +' + log.data.durationMs + 'ms'
                : ''
            }${log.data?.stack ? `  - ${log.data.stack}` : ''}${
              log.data?.props
                ? `\n  - Props: ${JSON.stringify(log.data.props, null, 4)}`
                : ''
            }`;
          }),
        ),
      }),
    ];
  }

  private getFormat() {
    return winston.format.combine(
      winston.format.timestamp({
        format: 'DD/MM/YYYY, HH:mm:ss',
      }),
      winston.format.errors({ stack: true }),
      winston.format((info, opts) => {
        if (info.error && info.error instanceof Error) {
          info.stack = info.error.stack;
          info.error = undefined;
        }
        info.label = `${info.appName}`;
        return info;
      })(),
      winston.format.metadata({
        key: 'data',
        fillExcept: ['timestamp', 'level', 'message'],
      }),
      winston.format.json(),
    );
  }

  private getWinstonOptions(): winston.LoggerOptions {
    const transports = this.getTransport();
    const levels: any = {};
    let cont = 0;
    Object.values(LogLevel).forEach((level) => {
      levels[level] = cont;
      cont++;
    });

    return {
      level: LogLevel.Debug,
      levels: levels,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        winston.format.errors({ stack: true }),
        winston.format((info, opts) => {
          if (info.error && info.error instanceof Error) {
            info.stack = info.error.stack;
            info.error = undefined;
          }
          info.label = `${info.appName}`;
          return info;
        })(),
        winston.format.metadata({
          key: 'data',
          fillExcept: ['timestamp', 'level', 'message'],
        }),
        winston.format.json(),
      ),
      transports: transports,
      exceptionHandlers: transports,
      rejectionHandlers: transports,
    };
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    const logData = {
      level: level,
      message: message instanceof Error ? message.message : message,
      error: message instanceof Error ? message : undefined,
      ...data,
    };

    if (profile) {
      this.logger.profile(profile, logData);
    } else {
      this.logger.log(logData);
    }
  }

  public debug(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Debug, message, data, profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    this.log(LogLevel.Info, message, data, profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Warn, message, data, profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Error, message, data, profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Fatal, message, data, profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    this.log(LogLevel.Emergency, message, data, profile);
  }

  public startProfile(id: string) {
    this.logger.profile(id);
  }
}
