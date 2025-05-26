import { Injectable } from '@nestjs/common';
import { firefox } from 'playwright';
import * as path from 'path';

@Injectable()
export class InstaGrabService {
  async scrapeInstagramPost(postUrl: string) {
    const browser = await firefox.launch({ headless: true });
    const context = await browser.newContext({
      storageState: path.join(process.cwd(), 'storageState.json'),
    });

    const page = await context.newPage();
    await page.goto(postUrl, { waitUntil: 'networkidle' });

    const isMultiPost = await page
      .locator('ul._acay')
      .isVisible()
      .catch(() => false);
    const imageList: string[] = [];

    if (!isMultiPost) {
      const post = page.locator('div._aagu').first();
      const src = await post.evaluate((item) => {
        const img = item.querySelector('img');
        return img?.getAttribute('src') ?? null;
      });

      if (src) imageList.push(src);
    } else {
      const postCount = await page.locator('div._acnb').count();

      for (let i = 0; i < postCount; i++) {
        await page.waitForSelector('ul._acay li._acaz');
        const items = page.locator('ul._acay li._acaz');

        const data = await items.evaluateAll((elements) => {
          return elements.map((el) => {
            const img = el.querySelector('img');
            return img?.src || '';
          });
        });

        imageList.push(...data);

        const nextBtn = page.locator('button[aria-label="Next"]');
        const isVisible = await nextBtn.isVisible().catch(() => false);
        if (isVisible) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        } else {
          break;
        }
      }
    }

    await browser.close();
    return [...new Set(imageList.filter(Boolean))];
  }
}
