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
  for (const w of [390, 768]) {
    await page.setViewport({ width: w, height: 844, deviceScaleFactor: 1 });
    await page.goto(BASE + '/#portfolio', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1200));
    await page.evaluate(() => {
      const el = document.getElementById('project-slider');
      if (el) el.scrollIntoView({ block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: `shot-controller-${w}.png`, type: 'png' });
    console.log(`saved shot-controller-${w}.png`);
  }
  await browser.close();
})();
