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

async function shot(page, slug, file, { w = 1440, h = 900, scrollTo = null, wait = 900 } = {}) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  if (scrollTo !== null) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
  }
  await sleep(wait);
  await page.screenshot({ path: path.join(dirFor(slug), file), type: 'png' });
  console.log('  shot', slug + '/' + file);
}

async function login(page, url, user, pass, fields = { email: 'input[name=email]', password: 'input[name=password]', submit: 'button[type=submit]' }) {
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForSelector(fields.email, { timeout: 15000 });
  await page.type(fields.email, user, { delay: 25 });
  await page.type(fields.password, pass, { delay: 25 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {}),
    page.click(fields.submit),
  ]);
  await sleep(700);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1'],
  });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(30000);

  // ============ 1. SISTEM KASIR RESTO (6 screens) ============
  console.log('\n=== sistem-kasir-resto ===');
  const resto = BASE + ':8101';
  await login(page, resto + '/login', 'admin@sisterkasir.test', 'password');
  await shot(page, 'sistem-kasir-resto', 'hero-mockup.png', { wait: 1200 }); // /admin dashboard
  await shot(page, 'sistem-kasir-resto', 'screen-1.png'); // admin dashboard (duplicate guard: we'll overwrite hero with another view below)
  // Actually hero = dashboard already captured. Overwrite screen-1 with POS:
  await page.goto(resto + '/kasir', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-resto', 'screen-1.png', { wait: 1000 }); // POS
  await page.goto(resto + '/admin/products', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-resto', 'screen-2.png', { wait: 1000 }); // products
  await page.goto(resto + '/orders', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-resto', 'screen-3.png', { wait: 1000 }); // orders
  await page.goto(resto + '/admin/reports/best-sellers', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-resto', 'screen-4.png', { wait: 1000 }); // best sellers
  await page.goto(resto + '/admin/reports/daily', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-resto', 'screen-5.png', { wait: 1000 }); // daily report
  // responsive
  await shot(page, 'sistem-kasir-resto', 'screen-6.png', { w: 390, h: 844, wait: 1000 }); // mobile daily report

  // ============ 2. SISTEM KASIR TOKO (6 screens) ============
  console.log('\n=== sistem-kasir-toko ===');
  const toko = BASE + ':8102';
  await page.goto(toko + '/coba-demo', { waitUntil: 'networkidle0' });
  await sleep(1200);
  await shot(page, 'sistem-kasir-toko', 'hero-mockup.png', { wait: 1000 }); // admin dashboard demo
  await page.goto(toko + '/', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-toko', 'screen-1.png', { wait: 1000 }); // landing
  await page.goto(toko + '/kasir', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-toko', 'screen-2.png', { wait: 1000 }); // POS
  await page.goto(toko + '/orders', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-toko', 'screen-3.png', { wait: 1000 }); // orders
  await page.goto(toko + '/admin/products', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-toko', 'screen-4.png', { wait: 1000 }); // products
  await page.goto(toko + '/admin/reports/daily', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-kasir-toko', 'screen-5.png', { wait: 1000 }); // reports
  await shot(page, 'sistem-kasir-toko', 'screen-6.png', { w: 390, h: 844, wait: 1000 }); // mobile

  // ============ 3. RESTORAN (3 screens) ============
  console.log('\n=== restoran ===');
  const restoran = BASE + ':8103';
  await page.goto(restoran + '/', { waitUntil: 'networkidle0' });
  await shot(page, 'restoran', 'hero-mockup.png', { wait: 1200 });
  await shot(page, 'restoran', 'screen-1.png', { scrollTo: 800, wait: 1000 }); // menu section
  await shot(page, 'restoran', 'screen-2.png', { w: 390, h: 844, wait: 1000 }); // mobile

  // ============ 4. SISTEM KEUANGAN TK2 (7 screens) ============
  console.log('\n=== sistem-keuangan-tk2 ===');
  const tk2 = BASE + ':8104';
  await login(page, tk2 + '/login', 'admin@tkmuslimatnu.sch.id', 'password', {
    email: 'input[name=email]',
    password: 'input[name=password]',
    submit: 'button[type=submit]',
  });
  await shot(page, 'sistem-keuangan-tk2', 'hero-mockup.png', { wait: 1200 }); // dashboard
  await page.goto(tk2 + '/admin/verifikasi', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-1.png', { wait: 1000 }); // verifikasi pembayaran
  await page.goto(tk2 + '/admin/tagihan', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-2.png', { wait: 1000 }); // kelola tagihan
  await page.goto(tk2 + '/admin/murid', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-3.png', { wait: 1000 }); // data murid
  await page.goto(tk2 + '/admin/laporan', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-4.png', { wait: 1000 }); // laporan
  await page.goto(tk2 + '/admin/tagihan/perorangan', { waitUntil: 'networkidle0' });
  await shot(page, 'sistem-keuangan-tk2', 'screen-5.png', { wait: 1000 }); // tagihan perorangan
  await shot(page, 'sistem-keuangan-tk2', 'screen-6.png', { w: 390, h: 844, wait: 1000 }); // mobile dashboard

  // ============ 5. WEB GARUDA DEMO (7 screens) ============
  console.log('\n=== Web-garuda-demo ===');
  const garuda = BASE + ':8105';
  await login(page, garuda + '/pages/auth/login.php', 'admin@garudaindonesia.com', 'admin123', {
    email: 'input[name=email]',
    password: 'input[name=password]',
    submit: 'form button[type=submit]',
  });
  await page.goto(garuda + '/admin/dashboard.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'hero-mockup.png', { wait: 1200 }); // admin dashboard
  await page.goto(garuda + '/admin/bookings.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-1.png', { wait: 1000 }); // bookings
  await page.goto(garuda + '/admin/tickets.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-2.png', { wait: 1000 }); // tickets
  await page.goto(garuda + '/admin/hotels.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-3.png', { wait: 1000 }); // hotels
  await page.goto(garuda + '/admin/payments.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-4.png', { wait: 1000 }); // payments
  await page.goto(garuda + '/admin/users.php', { waitUntil: 'networkidle0' });
  await shot(page, 'Web-garuda-demo', 'screen-5.png', { wait: 1000 }); // users
  await shot(page, 'Web-garuda-demo', 'screen-6.png', { w: 390, h: 844, wait: 1000 }); // mobile

  // ============ 6. ANTRIAN GARUDA (6 screens) ============
  console.log('\n=== Antrian-Garuda ===');
  const antrian = BASE + ':8106';
  await page.goto(antrian + '/login', { waitUntil: 'networkidle0' });
  await page.waitForSelector('input#email', { timeout: 15000 });
  await page.type('input#email', 'admin@antrian.com', { delay: 25 });
  await page.type('input#password', 'admin123', { delay: 25 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {}),
    page.click('button[type=submit]'),
  ]);
  await sleep(800);
  await page.goto(antrian + '/admin/queue', { waitUntil: 'networkidle0' });
  await shot(page, 'Antrian-Garuda', 'hero-mockup.png', { wait: 1200 }); // queue dashboard
  await page.goto(antrian + '/admin/queue/history', { waitUntil: 'networkidle0' });
  await shot(page, 'Antrian-Garuda', 'screen-1.png', { wait: 1000 }); // history
  await page.goto(antrian + '/admin/queue/visual-list', { waitUntil: 'networkidle0' });
  await shot(page, 'Antrian-Garuda', 'screen-2.png', { wait: 1000 }); // visual list
  await page.goto(antrian + '/ticket', { waitUntil: 'networkidle0' });
  await shot(page, 'Antrian-Garuda', 'screen-3.png', { wait: 1000 }); // public ticket
  await page.goto(antrian + '/display', { waitUntil: 'networkidle0' });
  await shot(page, 'Antrian-Garuda', 'screen-4.png', { wait: 1000 }); // public display
  await shot(page, 'Antrian-Garuda', 'screen-5.png', { w: 390, h: 844, wait: 1000 }); // mobile ticket

  // ============ 7. ANALISA SAHAM (5 screens) ============
  console.log('\n=== analisa-saham ===');
  const saham = BASE + ':8111';
  await page.goto(saham + '/', { waitUntil: 'networkidle0' });
  await shot(page, 'analisa-saham', 'hero-mockup.png', { wait: 1200 }); // dashboard
  await page.goto(saham + '/analisis', { waitUntil: 'networkidle0' });
  await shot(page, 'analisa-saham', 'screen-1.png', { wait: 1000 }); // analysis
  await page.goto(saham + '/hasil', { waitUntil: 'networkidle0' });
  await shot(page, 'analisa-saham', 'screen-2.png', { wait: 1000 }); // results
  await page.goto(saham + '/settings', { waitUntil: 'networkidle0' });
  await shot(page, 'analisa-saham', 'screen-3.png', { wait: 1000 }); // settings
  await shot(page, 'analisa-saham', 'screen-4.png', { w: 390, h: 844, wait: 1000 }); // mobile

  // ============ 8. BALI TRAVEL (5 screens) ============
  console.log('\n=== bali-travel ===');
  const bali = BASE + ':8112';
  await page.goto(bali + '/', { waitUntil: 'networkidle0' });
  await shot(page, 'bali-travel', 'hero-mockup.png', { wait: 1200 });
  await page.goto(bali + '/trips', { waitUntil: 'networkidle0' });
  await shot(page, 'bali-travel', 'screen-1.png', { wait: 1000 }); // trips
  await page.goto(bali + '/paket-tour', { waitUntil: 'networkidle0' });
  await shot(page, 'bali-travel', 'screen-2.png', { wait: 1000 }); // paket tour
  await page.goto(bali + '/instant-booking', { waitUntil: 'networkidle0' });
  await shot(page, 'bali-travel', 'screen-3.png', { wait: 1000 }); // instant booking
  await page.goto(bali + '/custom-trip', { waitUntil: 'networkidle0' });
  await shot(page, 'bali-travel', 'screen-4.png', { wait: 1000 }); // custom trip
  await shot(page, 'bali-travel', 'screen-5.png', { w: 390, h: 844, wait: 1000 }); // mobile

  // ============ 9. KAZAMI STORE (5 screens) ============
  console.log('\n=== kazami-store ===');
  const kazami = BASE + ':8113';
  await page.goto(kazami + '/', { waitUntil: 'networkidle0' });
  await shot(page, 'kazami-store', 'hero-mockup.png', { wait: 1200 });
  await page.goto(kazami + '/catalog', { waitUntil: 'networkidle0' });
  await shot(page, 'kazami-store', 'screen-1.png', { wait: 1000 }); // catalog
  await page.goto(kazami + '/singgasana-cinta', { waitUntil: 'networkidle0' });
  await shot(page, 'kazami-store', 'screen-2.png', { wait: 1000 }); // series detail
  await page.goto(kazami + '/singgasana-cinta/aruna', { waitUntil: 'networkidle0' });
  await shot(page, 'kazami-store', 'screen-3.png', { wait: 1000 }); // color detail
  await page.goto(kazami + '/cara-pre-order', { waitUntil: 'networkidle0' });
  await shot(page, 'kazami-store', 'screen-4.png', { wait: 1000 }); // pre-order guide
  await shot(page, 'kazami-store', 'screen-5.png', { w: 390, h: 844, wait: 1000 }); // mobile

  // ============ 10. WEB PONDOK (6 screens) ============
  console.log('\n=== web-pondok ===');
  const pondok = BASE + ':8114';
  await page.goto(pondok + '/', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'hero-mockup.png', { wait: 1200 });
  await page.goto(pondok + '/artikel', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'screen-1.png', { wait: 1000 }); // artikel index
  await page.goto(pondok + '/artikel/pendaftaran-ppdb-online-2026-2027-resmi-dibuka-100-gratis', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'screen-2.png', { wait: 1000 }); // artikel detail
  await page.goto(pondok + '/ppdb', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'screen-3.png', { wait: 1000 }); // ppdb
  await login(page, pondok + '/login', 'admin@pondok.test', 'password', {
    email: 'input[name=email]',
    password: 'input[name=password]',
    submit: 'button[type=submit]',
  });
  await shot(page, 'web-pondok', 'screen-4.png', { wait: 1000 }); // admin dashboard (after login)
  await page.goto(pondok + '/admin/ppdb', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'screen-5.png', { wait: 1000 }); // admin ppdb
  // screen-6 mobile
  await page.goto(pondok + '/', { waitUntil: 'networkidle0' });
  await shot(page, 'web-pondok', 'screen-6.png', { w: 390, h: 844, wait: 1000 });

  // ============ 11. RE-ENGINEERING MAYAR (5 screens) ============
  console.log('\n=== re-engineering-mayar ===');
  const mayar = BASE + ':8115';
  await login(page, mayar + '/login', 'test@example.com', 'password', {
    email: 'input[type=email], input[name=email]',
    password: 'input[type=password], input[name=password]',
    submit: 'button[type=submit]',
  });
  await shot(page, 're-engineering-mayar', 'hero-mockup.png', { wait: 1200 }); // dashboard (webinars)
  await page.goto(mayar + '/webinar-detail/1', { waitUntil: 'networkidle0' });
  await shot(page, 're-engineering-mayar', 'screen-1.png', { wait: 1000 }); // webinar detail
  await page.goto(mayar + '/user/webinars/purchase-history', { waitUntil: 'networkidle0' });
  await shot(page, 're-engineering-mayar', 'screen-2.png', { wait: 1000 }); // purchase history
  await page.goto(mayar + '/user/webinars/1/register', { waitUntil: 'networkidle0' });
  await shot(page, 're-engineering-mayar', 'screen-3.png', { wait: 1000 }); // register flow
  await shot(page, 're-engineering-mayar', 'screen-4.png', { w: 390, h: 844, wait: 1000 }); // mobile dashboard

  console.log('\nDONE ALL CAPTURES');
  await browser.close();
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
