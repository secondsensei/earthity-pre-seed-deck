const puppeteer = require('puppeteer-core');
const path = require('path');

const mode = process.argv[2] || 'pdf';
const name = process.argv[3] || 'deck';
// optional 4th arg: 1-based slide list for screenshots, e.g. "4" or "2,4-6"
const only = (process.argv[4] || '').split(',').map(s => s.trim()).filter(Boolean)
  .flatMap(tok => {
    const m = tok.match(/^(\d+)-(\d+)$/);
    if (!m) return [Number(tok)];
    const out = [];
    for (let i = Number(m[1]); i <= Number(m[2]); i++) out.push(i);
    return out;
  });
const wanted = only.length ? new Set(only) : null;
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const W = 1280, H = 720;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H });
  const url = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
  await page.goto(url, { waitUntil: 'networkidle0' });

  const N = await page.evaluate(() => document.querySelectorAll('.S').length);
  await page.evaluate((n) => {
    document.querySelectorAll('.S').forEach((s, i) => {
      s.setAttribute('data-slide-num', String(i + 1));
      s.setAttribute('data-slide-total', String(n));
    });
  }, N);

  if (mode === 'pdf' || mode === 'both') {
    await page.pdf({
      path: name + '.pdf',
      width: '13.33in',
      height: '7.5in',
      printBackground: true,
    });
    console.log('wrote ' + name + '.pdf');
  }

  if (mode === 'screenshots' || mode === 'both') {
    const last = wanted ? Math.max(...wanted) : N;
    for (let i = 0; i < last; i++) {
      if (i > 0) {
        await page.evaluate(() =>
          document.querySelector('.D').dispatchEvent(
            new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
          )
        );
        await new Promise(r => setTimeout(r, 600));
      }
      if (wanted && !wanted.has(i + 1)) continue;
      const file = name + '-' + String(i + 1).padStart(2, '0') + '.png';
      await page.screenshot({ path: file });
      console.log('wrote ' + file);
    }
  }

  await browser.close();
})();
