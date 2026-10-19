import { chromium } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const phase = process.argv[2] || 'before';
const origin = process.env.REVIEW_ORIGIN || 'http://127.0.0.1:3000';
const root = path.resolve(process.env.REVIEW_OUTPUT || '.scratch/site-refinement', phase);
const routes = ['/', '/about', '/contact', '/work/aurelia', '/work/paylecta', '/work/pawfriend', '/work/munchpal'];
(async () => {
  await fs.mkdir(root, { recursive: true });
  const browser = await chromium.launch();
  const records = [];
  const tiles = [];
  for (const width of phase === 'before' ? [320, 390, 768, 1440] : [320, 390, 768, 1440, 844, 1920]) {
    const height = width === 844 ? 390 : width < 768 ? 844 : 1000;
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 1000, isMobile: width < 768 || width === 844, reducedMotion: 'reduce', baseURL: origin });
    if (width === 1920) await context.addInitScript(() => localStorage.setItem('portfolio-theme-v1', 'dark'));
    for (const [index, route] of routes.entries()) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight * .8) { scrollTo(0, y); await new Promise(r => setTimeout(r, 35)); }
        await Promise.race([Promise.all(Array.from(document.images).filter(img => img.currentSrc).map(img => img.decode().catch(() => {}))), new Promise(r => setTimeout(r, 3000))]);
        scrollTo(0, 0);
      });
      const record = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        failedImages: Array.from(document.images).filter(img => img.currentSrc && img.complete && img.naturalWidth === 0).map(img => img.getAttribute('src')),
        height: document.body.scrollHeight,
        smallTargets: Array.from(document.querySelectorAll('main button, main summary, main a')).filter(e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width && r.height && s.display !== 'inline' && (r.width < 24 || r.height < 24); }).map(e => e.textContent.trim().slice(0, 70)),
        imageBytes: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img').reduce((n, r) => n + r.encodedBodySize, 0),
        largeImages: performance.getEntriesByType('resource').filter(r => r.initiatorType === 'img' && r.encodedBodySize > 500000).map(r => ({url:r.name.split('/').pop(),bytes:r.encodedBodySize})),
      }));
      records.push({ width, route, ...record, errors });
      if (width === 390 || width === 1440) {
        const filename = path.join(root, `${width}-${index}.png`);
        await page.screenshot({path:filename, fullPage:true});
        const buffer = await sharp(filename).extract({left:0,top:0,width,height:Math.min(record.height, width === 390 ? 1600 : 1000)}).resize(360,600,{fit:'contain',background:'#e5e5df'}).toBuffer();
        tiles.push({input:buffer,left:index*360,top:width === 390 ? 0 : 600});
      }
      if (width === 844 || width === 1920) await page.screenshot({path:path.join(root,`${width}-${index}.png`)});
      await page.close();
      console.log(JSON.stringify({width,route,overflow:record.overflow,failedImages:record.failedImages.length,errors:errors.length,imageKB:Math.round(record.imageBytes/1024)}));
    }
    await context.close();
  }
  await sharp({create:{width:2520,height:1200,channels:3,background:'#e5e5df'}}).composite(tiles).png().toFile(path.join(root,'overview.png'));
  await fs.writeFile(path.join(root,'records.json'),JSON.stringify(records,null,2));
  await browser.close();
})().catch(error => { console.error(error); process.exitCode=1; });
