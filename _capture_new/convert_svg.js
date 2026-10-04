const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

const dir = 'C:/laragon/www/portofolio-laravel/public/Assets/Logos';

(async () => {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.svg'));
  if (!files.length) {
    console.log('no svg files');
    return;
  }
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 160, height: 160, deviceScaleFactor: 1 });

  for (const f of files) {
    const svgPath = path.join(dir, f);
    const pngPath = svgPath.replace(/\.svg$/, '.png');
    const dataUrl = 'data:image/svg+xml;base64,' + fs.readFileSync(svgPath).toString('base64');
    await page.goto(dataUrl, { waitUntil: 'load' });
    // get SVG intrinsic size
    const dims = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return { w: 160, h: 160 };
      const vb = (svg.getAttribute('viewBox') || '0 0 128 128').split(' ');
      return { w: parseFloat(vb[2]) || 128, h: parseFloat(vb[3]) || 128 };
    });
    await page.setViewport({ width: Math.round(dims.w), height: Math.round(dims.h), deviceScaleFactor: 1 });
    await page.goto(dataUrl, { waitUntil: 'load' });
    await page.screenshot({ path: pngPath, type: 'png', omitBackground: true });
    console.log(`converted ${f} -> ${path.basename(pngPath)}`);
  }
  await browser.close();
})();
