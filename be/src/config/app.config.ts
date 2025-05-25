import { IsNumber, IsString } from 'class-validator';
import { registerConfig } from './util/config-register';

export class AppConfig {
  @IsString()
  APP_NAME: string;

  @IsNumber()
  APP_PORT: number;
}

export default registerConfig('app', AppConfig, ({ env }) => ({
  app: env.APP_NAME,
  port: env.APP_PORT,
}));
