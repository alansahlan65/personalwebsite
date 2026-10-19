import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';

const root = '.scratch/aurelia-detail-refresh';
const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const [name, width] of [['desktop', 1440], ['phone', 390]]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:3000/work/aurelia');
    await page.evaluate(() => document.fonts.ready);
    for (const image of await page.locator('main img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${root}/after-${name}.png`, fullPage: true, animations: 'disabled' });
    const tiles = [];
    for (const [index, id] of ['aurelia-media', 'aurelia-discovery', 'aurelia-collection', 'aurelia-details', 'aurelia-request', 'aurelia-implementation'].entries()) {
      const file = `${root}/${name}-${id}.png`;
      await page.locator(`#${id}`).screenshot({ path: file, animations: 'disabled' });
      tiles.push({ input: await sharp(file).resize(480, 680, { fit: 'contain', background: '#f6f5f1' }).png().toBuffer(), left: index % 3 * 480, top: Math.floor(index / 3) * 680 });
    }
    await sharp({ create: { width: 1440, height: 1360, channels: 3, background: '#f6f5f1' } }).composite(tiles).png().toFile(`${root}/sheet-${name}.png`);
    const geometry = await page.locator('main img').evaluateAll(images => images.map(image => ({ source: image.getAttribute('src'), width: image.naturalWidth, height: image.naturalHeight, displayed: image.getBoundingClientRect().width })));
    results.push({ name, width, documentWidth: await page.evaluate(() => document.documentElement.scrollWidth), errors, geometry });
    await page.close();
  }
  await fs.writeFile(`${root}/visual-check.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.map(({name,width,documentWidth,errors,geometry}) => ({name,width,documentWidth,errors,images:geometry.length}))));
} finally { await browser.close(); }
