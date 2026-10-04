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
  await page.goto(BASE + '/#work', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const timeline = await page.evaluate(() => {
    const arts = [...document.querySelectorAll('#experience article')];
    return arts.map((a) => ({
      year: a.querySelector('p.font-mono')?.textContent.trim(),
      title: a.querySelector('h3')?.textContent.trim(),
      org: a.querySelector('h3 + p')?.textContent.trim(),
    }));
  });
  console.log(JSON.stringify(timeline, null, 2));
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
