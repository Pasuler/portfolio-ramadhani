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

  const report = await page.evaluate(() => {
    const gdg = [...document.querySelectorAll('#experience article')].find((a) =>
      a.textContent.includes('GDGOC')
    );
    const heroLine = document.body.textContent.match(/IT Intern @[^\n]+/);
    return {
      gdgTitle: gdg ? gdg.querySelector('h3').textContent.trim() : null,
      gdgYear: gdg ? gdg.querySelector('p.font-mono').textContent.trim() : null,
      gdgDesc: gdg ? gdg.querySelector('h3 + p + p').textContent.trim() : null,
      heroLine: heroLine ? heroLine[0].trim() : null,
    };
  });
  console.log(JSON.stringify(report, null, 2));
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
