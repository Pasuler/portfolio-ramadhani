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

  const report = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll('.orbit-node')];
    const logos = [...document.querySelectorAll('.orbit-node img, .grid img')].filter((img) => img.closest('.orbit-node') || img.closest('.grid'));
    const loaded = logos.filter((img) => img.complete && img.naturalWidth > 0).length;
    return {
      orbitVisible: !!document.querySelector('.orbit-node'),
      nodeCount: nodes.length,
      logoLoaded: loaded,
      logoTotal: logos.length,
    };
  });
  console.log(JSON.stringify(report, null, 2));

  await page.evaluate(() => document.getElementById('skills').scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'shot-skills.png', type: 'png' });
  console.log('saved shot-skills.png');
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
