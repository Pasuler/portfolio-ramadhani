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
  await page.goto(BASE + '/#portfolio', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));

  const result = await page.evaluate(() => {
    const slider = document.getElementById('project-slider');
    const progress = document.getElementById('slider-progress');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');

    slider.scrollLeft = slider.scrollWidth; // jump to far right
    // force scroll event to fire
    slider.dispatchEvent(new Event('scroll'));

    const pRect = progress.getBoundingClientRect();
    const aRect = prevBtn.getBoundingClientRect();
    const nRect = nextBtn.getBoundingClientRect();

    return {
      progressRight: Math.round(pRect.right),
      prevLeft: Math.round(aRect.left),
      prevRight: Math.round(aRect.right),
      nextLeft: Math.round(nRect.left),
      overlapPrev: pRect.right > aRect.left,
      overlapNext: pRect.right > nRect.left,
      cssLeft: progress.style.left,
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
