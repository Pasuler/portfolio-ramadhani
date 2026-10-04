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
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE + '/#about', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const report = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll('.cert-stream img')].map((img) => ({
      src: img.src.split('/').pop(),
      loaded: img.complete && img.naturalWidth > 0,
    }));
    return imgs;
  });
  console.log(JSON.stringify(report, null, 2));

  // Click 4th cert and check counter
  await page.evaluate(() => {
    const imgs = document.querySelectorAll('.cert-stream img');
    if (imgs[3]) imgs[3].click();
  });
  await new Promise((r) => setTimeout(r, 800));
  const lb = await page.evaluate(() => ({
    visible: !document.getElementById('lightbox').classList.contains('hidden'),
    caption: document.getElementById('lightbox-caption').textContent,
    count: document.getElementById('lightbox-count').textContent,
  }));
  console.log('lightbox:', JSON.stringify(lb));
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
