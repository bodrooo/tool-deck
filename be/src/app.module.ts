import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { InstaGrabModule } from './modules/insta-grab/insta-grab.module';
import configs from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: configs,
    }),
    CommonModule,
    InstaGrabModule,
  ],
})
export class AppModule {}
