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
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const report = await page.evaluate(() => {
    const navItems = [...document.querySelectorAll('.nav-link')].map((a) => a.textContent.trim());
    const sections = [...document.querySelectorAll('section[id]')].map((s) => s.id);
    const logos = [...document.querySelectorAll('.orbit-node img')].map((img) => ({
      alt: img.alt,
      loaded: img.complete && img.naturalWidth > 0,
    }));
    return { navItems, sections, orbitLogoCount: logos.length, orbitLogosLoaded: logos.filter((l) => l.loaded).length };
  });
  console.log(JSON.stringify(report, null, 2));
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
