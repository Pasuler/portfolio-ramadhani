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
  await page.goto(BASE + '/#about', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  });
  await new Promise((r) => setTimeout(r, 500));

  const report = await page.evaluate(() => {
    const certImgs = [...document.querySelectorAll('.cert-thumb img')].map((img) => ({
      src: img.src.split('/').pop(),
      loaded: img.complete && img.naturalWidth > 0,
    }));
    const avatarInCert = [...document.querySelectorAll('.cert-thumb img')].some((img) =>
      img.alt.toLowerCase().includes('photo')
    );
    const skills = [...document.querySelectorAll('.rounded-full')].map((s) => s.textContent.trim()).slice(0, 14);
    return { certImgs, avatarInCert, skills };
  });
  console.log(JSON.stringify(report, null, 2));

  // screenshot certs area
  await page.evaluate(() => {
    const c = document.querySelector('.cert-thumb');
    if (c) c.scrollIntoView({ block: 'center' });
  });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'shot-certs.png', type: 'png' });

  // JS errors
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  console.log('js errors:', errors.length ? errors : 'none');
  await browser.close();
})();
