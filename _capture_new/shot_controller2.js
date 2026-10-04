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
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(BASE + '/#portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1200));

  // scroll the project-slider into view near bottom
  await page.evaluate(() => {
    const el = document.getElementById('project-slider');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: 'shot-controller2.png', type: 'png', fullPage: false });
  console.log('saved shot-controller2.png');
  await browser.close();
})();
