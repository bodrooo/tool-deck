import { Module } from '@nestjs/common';
import { InstaGrabService } from './insta-grab.service';
import { InstaGrabController } from './insta-grab.controller';

@Module({
  controllers: [InstaGrabController],
  providers: [InstaGrabService],
})
export class InstaGrabModule {}
