const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://127.0.0.1:8080';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE + '/#portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const expected = {
    0: 7, 1: 7, 2: 3, 3: 7, 4: 7, 5: 6,
    6: 5, 7: 6, 8: 6, 9: 7, 10: 5,
  };

  let pass = 0, fail = 0;
  for (let i = 0; i < 11; i++) {
    await page.evaluate((idx) => {
      document.querySelectorAll('[data-case-open]')[idx].click();
    }, i);
    await new Promise((r) => setTimeout(r, 500));

    // click first lightbox image to trigger openLightbox and dedupe
    await page.evaluate((idx) => {
      const panel = document.querySelector('[data-case-panel="' + idx + '"]');
      panel.querySelector('[data-lightbox-src]').click();
    }, i);
    await new Promise((r) => setTimeout(r, 400));

    const info = await page.evaluate(() => {
      const dots = document.querySelectorAll('#lightbox-dots .lightbox-dot').length;
      const count = document.getElementById('lightbox-count')?.textContent || '';
      const caption = document.getElementById('lightbox-caption')?.textContent || '';
      return { dots, count, caption };
    });
    const exp = expected[i];
    const ok = info.dots === exp;
    if (ok) pass++; else fail++;
    console.log(`#${i}: ${ok ? 'OK ' : 'FAIL'} lightbox items=${info.dots} (exp ${exp}) ${info.count} "${info.caption}"`);

    // close lightbox then case
    await page.evaluate(() => document.querySelector('[data-lightbox-close]')?.click());
    await new Promise((r) => setTimeout(r, 250));
    await page.evaluate(() => document.getElementById('case-close')?.click());
    await new Promise((r) => setTimeout(r, 250));
  }

  console.log(`\nPASS=${pass} FAIL=${fail}`);
  await browser.close();
  process.exit(fail > 0 ? 1 : 0);
})();
