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

  for (const w of [390, 768, 1440]) {
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
    await page.goto(BASE + '/#portfolio', { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 1000));

    const result = await page.evaluate(async () => {
      const slider = document.getElementById('project-slider');
      const progress = document.getElementById('slider-progress');
      const prevBtn = document.getElementById('slider-prev');
      const nextBtn = document.getElementById('slider-next');

      slider.scrollLeft = slider.scrollWidth; // far right
      slider.dispatchEvent(new Event('scroll'));
      await new Promise((r) => setTimeout(r, 350)); // let CSS transition finish

      const pRect = progress.getBoundingClientRect();
      const aRect = prevBtn.getBoundingClientRect();
      const nRect = nextBtn.getBoundingClientRect();
      const trackRect = progress.parentElement.getBoundingClientRect();

      return {
        viewport: window.innerWidth,
        trackRight: Math.round(trackRect.right),
        progressLeft: Math.round(pRect.left),
        progressRight: Math.round(pRect.right),
        prevLeft: Math.round(aRect.left),
        nextLeft: Math.round(nRect.left),
        barFullyInsideTrack: pRect.right <= trackRect.right + 0.5 && pRect.left >= trackRect.left - 0.5,
        overlapPrev: pRect.right > aRect.left,
        overlapNext: pRect.right > nRect.left,
        cssLeft: progress.style.left,
      };
    });
    console.log(JSON.stringify(result));
  }
  await browser.close();
})();
