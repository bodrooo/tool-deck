import { Controller, Get, Query } from '@nestjs/common';
import { InstaGrabService } from './insta-grab.service';

@Controller('insta-grab')
export class InstaGrabController {
  constructor(private readonly instaGrabService: InstaGrabService) { }

  @Get()
  async scrape(@Query('url') url: string) {
    if (!url) {
      return { error: 'Missing ?url= parameter' };
    }

    const images = await this.instaGrabService.scrapeInstagramPost(url);
    return { images };
  }
}
