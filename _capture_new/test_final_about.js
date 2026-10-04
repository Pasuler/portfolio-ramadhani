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
    const ig = document.querySelector('a[aria-label="Instagram"]');
    const skills = [...document.querySelectorAll('.rounded-full')].map((s) => s.textContent.trim());
    const services = [...document.querySelectorAll('#services h3')].map((h) => h.textContent.trim());
    const overline = document.querySelector('#about p.font-mono')?.textContent.trim();
    return {
      igHref: ig ? ig.href : null,
      overline,
      hasMobileSkill: skills.includes('Mobile Development'),
      skillsCount: skills.length,
      hasMobileService: services.includes('Mobile Development'),
      services,
    };
  });
  console.log(JSON.stringify(report, null, 2));
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
