import { registerAs } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import validateConfig from './validator';

export const registerConfig = <
  TConfig extends object,
  TResult = Partial<TConfig>,
>(
  name: string,
  configClass: ClassConstructor<TConfig>,
  factory: (params: { env: TConfig }) => any,
) =>
  registerAs(name, () => {
    const rawEnv = plainToInstance(configClass, process.env, {
      enableImplicitConversion: true,
    }) as any;

    validateConfig(rawEnv, configClass);

    return factory({ env: rawEnv });
  });
