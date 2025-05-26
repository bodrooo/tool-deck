import { test, expect } from '@playwright/test';

test.use({
  storageState: 'storageState.json',
  browserName: 'firefox',
});

test('akses halaman post Instagram', async ({ page }) => {
  // await page.goto(
  //   'https://www.instagram.com/p/DF2fuJgPOJj/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==',
  // );

  // await page.setUserAgent(
  //   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  // );
  await page.goto(
    'https://www.instagram.com/p/DGJJoAFAtiY/?img_index=1&igsh=MXhqbnZvaWJ4eDly',
  );

  if (!(await page.isVisible('ul._acay'))) {
    console.log('Single Post');
    const post = page.locator('div._aagu').first();
    const data = await post.evaluateAll((items) => {
      return items.map((item) => {
        return item.querySelector('img')?.getAttribute('src');
      });
    });
  } else {
    const postCount = await page.locator('div._acnb').count();
    const imageList: string[] = [];

    for (let i = 0; i < postCount; i++) {
      const items = page.locator('ul._acay li._acaz');

      const data = await items.evaluateAll((elements) => {
        return elements.map((el) => {
          const img = el.querySelector('img');
          return img?.src || '';
        });
      });

      imageList.push(...data);

      const nextBtn = page.locator('button[aria-label="Next"]');
      const isVisible = await nextBtn.isVisible();
      if (isVisible) {
        await nextBtn.click();
        await page.waitForTimeout(1000);
      } else {
        break;
      }
    }
  }
});
