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

  // Click first certificate
  const clicked = await page.evaluate(() => {
    const cert = document.querySelector('.cert-stream img');
    if (!cert) return { ok: false, msg: 'no cert img' };
    cert.click();
    return { ok: true, alt: cert.alt };
  });
  await new Promise((r) => setTimeout(r, 800));

  const state = await page.evaluate(() => {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const count = document.getElementById('lightbox-count');
    const dots = document.querySelectorAll('#lightbox-dots .lightbox-dot').length;
    return {
      visible: !lb.classList.contains('hidden'),
      opacity100: lb.classList.contains('opacity-100'),
      imgSrc: img.src.split('/').pop(),
      imgLoaded: img.complete && img.naturalWidth > 0,
      caption: caption.textContent,
      count: count.textContent,
      dots,
    };
  });
  console.log('clicked:', JSON.stringify(clicked));
  console.log('lightbox:', JSON.stringify(state, null, 2));

  // Test next navigation
  await page.keyboard.press('ArrowRight');
  await new Promise((r) => setTimeout(r, 400));
  const after = await page.evaluate(() => ({
    count: document.getElementById('lightbox-count').textContent,
    caption: document.getElementById('lightbox-caption').textContent,
  }));
  console.log('after ArrowRight:', JSON.stringify(after));

  // Screenshot lightbox with cert
  await page.screenshot({ path: 'shot-cert-lightbox.png', type: 'png' });
  console.log('saved shot-cert-lightbox.png');
  await browser.close();
})();
