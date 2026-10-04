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
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto(BASE + '/#portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const cards = await page.$$('[data-case-open]');
  console.log('cards:', cards.length);

  const expected = {
    0: 7, 1: 7, 2: 7, 3: 7, 4: 6,
    5: 5, 6: 6, 7: 6, 8: 6,
  };
  let pass = 0, fail = 0;
  for (let i = 0; i < cards.length; i++) {
    await page.evaluate((idx) => document.querySelectorAll('[data-case-open]')[idx].click(), i);
    await new Promise((r) => setTimeout(r, 400));
    await page.evaluate((idx) => {
      const panel = document.querySelector('[data-case-panel="' + idx + '"]');
      panel.querySelector('[data-lightbox-src]').click();
    }, i);
    await new Promise((r) => setTimeout(r, 300));
    const n = await page.evaluate(() => document.querySelectorAll('#lightbox-dots .lightbox-dot').length);
    const exp = expected[i];
    const ok = n === exp;
    if (ok) pass++; else fail++;
    console.log(`#${i}: ${ok ? 'OK ' : 'FAIL'} lightbox=${n} (exp ${exp})`);
    await page.evaluate(() => document.querySelector('[data-lightbox-close]')?.click());
    await new Promise((r) => setTimeout(r, 200));
    await page.evaluate(() => document.getElementById('case-close')?.click());
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nPASS=${pass} FAIL=${fail} JS_errors=${errors.length}`);
  await browser.close();
  process.exit(fail > 0 || errors.length > 0 ? 1 : 0);
})();
