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
      naturalW: img.naturalWidth,
      naturalH: img.naturalHeight,
    }));
    return imgs;
  });
  console.log(JSON.stringify(report, null, 2));

  // Screenshot cert stream area
  await page.evaluate(() => {
    const c = document.querySelector('.cert-thumb');
    if (c) c.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'shot-certs-rotated.png', type: 'png' });
  console.log('saved shot-certs-rotated.png');
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
