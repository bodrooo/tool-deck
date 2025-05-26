import { firefox } from 'playwright';
// import fs from 'fs';

const TIME_IN_MS = 60000;

(async () => {
  const browser = await firefox.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://instagram.com');
  console.log('Silakan login secara manual dalam waktu 60 detik...');

  let remaining = TIME_IN_MS / 1000;
  const countdown = setInterval(() => {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(1);
    console.log(remaining);
    remaining--;
    if (remaining < 0) {
      clearInterval(countdown);
    }
  }, 1000);

  await page.waitForTimeout(TIME_IN_MS);
  await context.storageState({ path: 'storageState.json' });
  console.log('Session berhasil disimpan ke storageState.json');

  await browser.close();
})();
