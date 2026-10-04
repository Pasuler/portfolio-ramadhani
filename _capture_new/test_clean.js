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

  const cards = await page.$$('[data-case-open]');
  console.log('cards found:', cards.length);

  const expectedImages = {
    0: 7, // sistem-kasir-resto hero + 6
    1: 7, // sistem-kasir-toko
    2: 3, // restoran
    3: 7, // sistem-keuangan-tk2
    4: 7, // Web-garuda-demo
    5: 6, // Antrian-Garuda
    6: 5, // analisa-saham
    7: 6, // bali-travel
    8: 6, // kazami-store
    9: 7, // web-pondok
    10: 5, // re-engineering-mayar
  };

  let pass = 0, fail = 0;
  for (let i = 0; i < cards.length; i++) {
    await page.evaluate((idx) => {
      const c = document.querySelectorAll('[data-case-open]')[idx];
      c.click();
    }, i);
    await new Promise((r) => setTimeout(r, 500));
    const info = await page.evaluate((idx) => {
      const panel = document.querySelector('[data-case-panel="' + idx + '"]');
      const caseStudy = document.getElementById('case-study');
      const imgs = panel.querySelectorAll('[data-lightbox-src]').length;
      const title = panel.querySelector('h2, h1')?.textContent?.trim() || '';
      const meta = document.getElementById('case-meta')?.textContent || '';
      const visible = !caseStudy.classList.contains('invisible');
      return { idx, imgs, title: title.slice(0, 40), meta, visible };
    }, i);
    const exp = expectedImages[i] || '?';
    const ok = info.visible && info.imgs === exp;
    if (ok) pass++; else fail++;
    console.log(`#${i}: ${ok ? 'OK ' : 'FAIL'} imgs=${info.imgs} (exp ${exp}) meta=${info.meta} title="${info.title}"`);
    // close
    await page.evaluate(() => document.getElementById('case-close')?.click());
    await new Promise((r) => setTimeout(r, 300));
  }

  // JS errors
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  console.log('\nJS errors during test:', errors.length);
  console.log(`PASS=${pass} FAIL=${fail}`);
  await browser.close();
  process.exit(fail > 0 ? 1 : 0);
})();
