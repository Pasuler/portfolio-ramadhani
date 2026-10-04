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
  await page.goto(BASE + '/#contact', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const report = await page.evaluate(() => {
    const waLinks = [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => ({
      href: a.getAttribute('href'),
      text: a.textContent.trim().replace(/\s+/g, ' ').slice(0, 60),
    }));
    const contactText = document.getElementById('contact').textContent;
    return {
      waLinks,
      contactHasNumber: contactText.includes('0895-3425-8692'),
      telLinksLeft: [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href')),
    };
  });
  console.log(JSON.stringify(report, null, 2));
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
