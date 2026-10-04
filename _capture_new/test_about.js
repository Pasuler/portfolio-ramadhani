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
  await new Promise((r) => setTimeout(r, 1200));

  // force reveal animations to complete
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  });
  await new Promise((r) => setTimeout(r, 500));

  // check image loads + element presence
  const report = await page.evaluate(() => {
    const avatar = document.querySelector('img[alt*="real photo"]');
    const cert = document.querySelector('img[alt*="AI Career Readiness"]');
    const socials = document.querySelectorAll('.social-block').length;
    const chips = document.querySelectorAll('.tech-chip').length;
    const skills = document.querySelectorAll('.rounded-full').length;
    return {
      avatarLoaded: avatar ? avatar.complete && avatar.naturalWidth > 0 : false,
      certLoaded: cert ? cert.complete && cert.naturalWidth > 0 : false,
      socials,
      chips,
      skills,
    };
  });
  console.log(JSON.stringify(report, null, 2));

  // scroll about section into view & screenshot
  await page.evaluate(() => document.getElementById('about').scrollIntoView({ block: 'start' }));
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: 'shot-about.png', type: 'png' });
  console.log('saved shot-about.png');
  await browser.close();
})();
