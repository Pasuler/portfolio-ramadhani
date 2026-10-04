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
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(BASE + '/#skills', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const mobileGrid = await page.evaluate(() => {
    const orbit = document.querySelector('.orbit-node');
    const grid = document.querySelector('.grid');
    return {
      orbitHidden: orbit ? getComputedStyle(orbit.closest('.relative.mt-16')).display === 'none' : 'no orbit',
      gridVisible: !!grid,
      gridCols: grid ? getComputedStyle(grid).gridTemplateColumns : null,
    };
  });
  console.log(JSON.stringify(mobileGrid, null, 2));

  await page.evaluate(() => document.getElementById('skills').scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'shot-skills-mobile.png', type: 'png' });
  console.log('saved shot-skills-mobile.png');
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
