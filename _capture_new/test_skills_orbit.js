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
  await page.goto(BASE + '/#skills', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  // Center the orbit in the viewport
  await page.evaluate(() => {
    const orbit = document.querySelector('.orbit-node');
    if (orbit) orbit.closest('.relative.mt-16').scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'shot-skills-orbit.png', type: 'png' });
  console.log('saved shot-skills-orbit.png');
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
