import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const variant = process.argv[2] || 'baseline';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
if (variant === 'transform' || process.argv.includes('--transform')) await page.addInitScript(() => {
  const supports = CSS.supports.bind(CSS);
  CSS.supports = (...args) => args[0] === 'zoom' ? false : supports(...args);
});
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const standalone = process.argv.includes('--standalone');
await page.goto(standalone ? pathToFileURL(path.resolve('public/demos/aurelia/index.html')).href : 'http://127.0.0.1:3000/work/aurelia');
const iframe = standalone ? page.locator('#stage') : page.locator('iframe[title="36-second Aurelia product tour"]');
await iframe.waitFor();
const frame = standalone ? page : await iframe.contentFrame();
await frame.locator('body').evaluate(() => new Promise(resolve => {
  function ready() { if (window.__tour?.ready) resolve(); else requestAnimationFrame(ready); }
  ready();
}));
await frame.locator('body').evaluate(() => window.__tour.pause());
if (variant === 'no-blur' || variant === 'no-shadow') await frame.locator('body').evaluate((_body, variant) => {
  const style = document.createElement('style');
  style.textContent = variant === 'no-shadow' ? '#shared-photo { box-shadow: none !important; }' : '* { backdrop-filter: none !important; }';
  document.head.append(style);
}, variant);
const cdp = await page.context().newCDPSession(page);
await cdp.send('Performance.enable');
async function metrics() {
  const { metrics } = await cdp.send('Performance.getMetrics');
  return Object.fromEntries(metrics.map(metric => [metric.name, metric.value]));
}
const shots = [];
const sequence = process.argv.includes('--full') ? [['opening', 0, 5], ['hero-to-gallery', 5, 9], ['date-camera', 17.2, 4], ['revision', 26, 5], ['closing-and-loop', 31, 7]] : process.argv.includes('--lift') ? [['image-lift', 8.18, 2]] : process.argv.includes('--closing') ? [['closing-and-loop', 31, 7]] : process.argv.includes('--dates') ? [['date-camera', 17.2, 4]] : [['hero-to-gallery', 5, 9], ['date-camera', 17.2, 4]];
for (const [label, start, seconds] of sequence) {
  await frame.locator('body').evaluate((_body, time) => window.__tour.seek(time), start);
  await page.waitForTimeout(150);
  const before = await metrics();
  const measured = await frame.locator('body').evaluate((_body, seconds) => new Promise(resolve => {
    const deltas = [], missed = []; let last, end;
    window.__tour.play();
    function sample(now) {
      end ??= now + seconds * 1000;
      if (last !== undefined) {
        const delta = now - last;
        deltas.push(delta);
        if(delta > 25) missed.push({time:Number(window.__tour.time.toFixed(2)),intervalMs:Number(delta.toFixed(2))});
      }
      last = now;
      if (now < end) requestAnimationFrame(sample);
      else { window.__tour.pause(); resolve({deltas:deltas.slice(2),missed}); }
    }
    requestAnimationFrame(sample);
  }), seconds);
  const after = await metrics();
  const samples = measured.deltas;
  const ordered = samples.toSorted((a,b) => a-b);
  const lostFrames = samples.reduce((sum, delta) => sum + Math.max(0, Math.round(delta / (1000 / 60)) - 1), 0);
  const droppedPercent = 100 * lostFrames / (samples.length + lostFrames);
  const renderer = Object.fromEntries(['LayoutCount', 'LayoutDuration', 'RecalcStyleCount', 'RecalcStyleDuration', 'ScriptDuration', 'TaskDuration'].map(key => [key, Number((after[key] - before[key]).toFixed(4))]));
  shots.push({ label, sampledFrames: samples.length, lostFrames, droppedPercent: Number(droppedPercent.toFixed(2)), p95FrameMs: Number(ordered[Math.floor(ordered.length*.95)].toFixed(2)), missed:measured.missed, renderer });
}
const report = { variant, standalone, viewport: await iframe.boundingBox(), shots, errors };
await fs.writeFile(path.resolve(`.scratch/aurelia-design-tour/header-review/performance-${variant}${standalone ? '-isolated' : ''}.json`), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
// A failed gate is the regression signal; no recording or screenshots run during measurement.
if (errors.length || shots.some(shot => shot.droppedPercent > 2 || shot.p95FrameMs > 20)) process.exitCode = 1;
