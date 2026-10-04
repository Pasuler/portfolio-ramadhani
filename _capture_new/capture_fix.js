const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = 'C:/laragon/www/portofolio-laravel/public/Assets/Profile';
const BASE = 'http://127.0.0.1';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function dirFor(slug) {
  const d = path.join(OUT, slug);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  return d;
}
async function shot(page, slug, file, { w = 1440, h = 900, wait = 900 } = {}) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await sleep(wait);
  await page.screenshot({ path: path.join(dirFor(slug), file), type: 'png' });
  console.log('  shot', slug + '/' + file);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(30000);

  // === 1. Web-garuda-demo: login + recapture all ===
  console.log('\n=== Web-garuda-demo FIX ===');
  const garuda = BASE + ':8105';
  await page.goto(garuda + '/pages/auth/login.php', { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[name=email]', { timeout: 15000 });
  await page.type('input[name=email]', 'admin@garudaindonesia.com', { delay: 20 });
  await page.type('input[name=password]', 'admin123', { delay: 20 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {}),
    page.click('button[type=submit]'),
  ]);
  await sleep(800);
  await page.goto(garuda + '/admin/dashboard.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'hero-mockup.png', { wait: 1200 });
  await page.goto(garuda + '/admin/bookings.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-1.png', { wait: 1000 });
  await page.goto(garuda + '/admin/tickets.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-2.png', { wait: 1000 });
  await page.goto(garuda + '/admin/hotels.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-3.png', { wait: 1000 });
  await page.goto(garuda + '/admin/payments.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-4.png', { wait: 1000 });
  await page.goto(garuda + '/admin/users.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-5.png', { wait: 1000 });
  await page.goto(garuda + '/index.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-6.png', { w: 390, h: 844, wait: 1000 });

  // === 2. sistem-keuangan-tk2: select admin radio + login + recapture ===
  console.log('\n=== sistem-keuangan-tk2 FIX ===');
  const tk2 = BASE + ':8104';
  await page.goto(tk2 + '/login', { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[name=email]', { timeout: 15000 });
  // click admin radio
  await page.evaluate(() => {
    const radios = document.querySelectorAll('input[name=peran]');
    const admin = Array.from(radios).find((r) => r.value === 'admin');
    if (admin) admin.click();
  });
  await sleep(300);
  await page.type('input[name=email]', 'admin@tkmuslimatnu.sch.id', { delay: 20 });
  await page.type('input[name=password]', 'password', { delay: 20 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {}),
    page.click('button[type=submit]'),
  ]);
  await sleep(800);
  await shot(page, 'sistem-keuangan-tk2', 'hero-mockup.png', { wait: 1200 });
  await page.goto(tk2 + '/admin/verifikasi', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-1.png', { wait: 1000 });
  await page.goto(tk2 + '/admin/tagihan', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-2.png', { wait: 1000 });
  await page.goto(tk2 + '/admin/murid', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-3.png', { wait: 1000 });
  await page.goto(tk2 + '/admin/laporan', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-4.png', { wait: 1000 });
  await page.goto(tk2 + '/admin/tagihan/perorangan', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-5.png', { wait: 1000 });
  await page.goto(tk2 + '/admin', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-6.png', { w: 390, h: 844, wait: 1000 });

  // === 3. web-pondok: admin login + admin pages recapture ===
  console.log('\n=== web-pondok FIX ===');
  const pondok = BASE + ':8114';
  await page.goto(pondok + '/login', { waitUntil: 'networkidle0' });
  await page.waitForSelector('input[name=email]', { timeout: 15000 });
  await page.type('input[name=email]', 'admin@pondok.test', { delay: 20 });
  await page.type('input[name=password]', 'password', { delay: 20 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {}),
    page.click('button[type=submit]'),
  ]);
  await sleep(800);
  await page.goto(pondok + '/admin/ppdb', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'screen-5.png', { wait: 1000 });
  // admin dashboard: go to /admin
  await page.goto(pondok + '/admin', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'screen-4.png', { wait: 1000 });

  console.log('\nDONE FIX');
  await browser.close();
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
