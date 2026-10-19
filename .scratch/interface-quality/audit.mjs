import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] ?? 'before';
const base = process.env.AUDIT_URL ?? 'http://127.0.0.1:3000';
const output = 'C:/Users/DESKTOP-IOT0021/.codex/visualizations/2026/10/01/01a0f526-4b45-7362-a5c0-a545d2a9003d/interface-quality';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const results = { phase, layouts: [], performance: [] };
try {
  for (const [width, height, touch] of [[320, 740, true], [390, 844, true], [650, 900, false], [651, 900, false], [768, 1024, true], [1000, 800, false], [1440, 1000, false], [1920, 1080, false], [844, 390, true]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: touch, isMobile: touch });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const route of ['/', '/about', '/contact', '/work/aurelia']) {
      await page.goto(base + route);
      await page.waitForFunction(() => document.documentElement.dataset.pointerEnhancementsMounted === 'true');
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        failures: [...document.querySelectorAll('img')].filter(image => image.complete && !image.naturalWidth).map(image => image.src),
        tinyTargets: [...document.querySelectorAll('a, button, input, select, textarea')].filter(node => {
          const bounds = node.getBoundingClientRect();
          return bounds.width > 0 && bounds.height > 0 && getComputedStyle(node).visibility !== 'hidden' && (bounds.width < 24 || bounds.height < 24);
        }).map(node => node.textContent.trim().slice(0, 40)),
      }));
      results.layouts.push({ width, height, touch, route, ...layout, errors: [...errors] });
      if ([320, 390, 768, 1440].includes(width) && route !== '/work/aurelia') {
        await page.evaluate(async () => {
          for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * .6) {
            window.scrollTo(0, y);
            await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          }
        });
        await page.waitForTimeout(450);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: `${output}/${phase}-${width}-${route === '/' ? 'home' : route.slice(1)}.png`, fullPage: true });
      }
    }
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.getByRole('button', { name: 'Open menu' }).click();
    await page.waitForSelector('.stairs-menu[data-phase="open"]');
    results.layouts.push({ width, height, route: 'menu', overflow: await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), menuScroll: await page.locator('.stairs-menu').evaluate(node => ({ height: node.clientHeight, content: node.scrollHeight })) });
    if (width === 844 || width === 320) await page.screenshot({ path: `${output}/${phase}-${width}-menu.png` });
    await context.close();
  }
  for (const touch of [false, true]) {
    const context = await browser.newContext({ viewport: touch ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, hasTouch: touch, isMobile: touch });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.auditReads = {};
      const original = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function (...args) {
        const key = this.getAttribute('aria-label') ?? this.id ?? this.tagName;
        window.auditReads[key] = (window.auditReads[key] ?? 0) + 1;
        return original.apply(this, args);
      };
      window.auditShifts = 0;
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.auditShifts += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto(base + '/');
    await page.waitForFunction(() => document.documentElement.dataset.pointerEnhancementsMounted === 'true');
    await page.waitForFunction(() => [...document.querySelectorAll('.hero-portrait img')].every(image => image.complete && image.naturalWidth));
    await page.waitForTimeout(650);
    const burst = await page.evaluate(async () => {
      window.auditReads = {};
      const target = document.querySelector('.primary-nav a');
      for (let i = 0; i < 200; i++) target.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse', clientX: 500 + i, clientY: 50 + i }));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { ...window.auditReads };
    });
    const scrollBurst = await page.evaluate(async () => {
      window.auditReads = {};
      for (let i = 0; i < 100; i++) window.dispatchEvent(new Event('scroll'));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return { ...window.auditReads };
    });
    await page.evaluate(() => {
      window.auditFrames = [];
      window.auditRunning = true;
      let last = performance.now();
      function sample(now) { window.auditFrames.push(now - last); last = now; if (window.auditRunning) requestAnimationFrame(sample); }
      requestAnimationFrame(sample);
    });
    for (let index = 0; index < 36; index++) {
      await page.mouse.move(200 + index * 28, 350 + Math.sin(index / 3) * 200, { steps: 3 });
      if (index % 6 === 0) await page.mouse.wheel(0, index < 24 ? 350 : -600);
      await page.waitForTimeout(25);
    }
    const metrics = await page.evaluate(() => {
      window.auditRunning = false;
      const frames = window.auditFrames.slice(1).sort((a, b) => a - b);
      const resources = performance.getEntriesByType('resource').filter(entry => entry.initiatorType === 'img' || entry.name.includes('_next/image'));
      return { frameP95: frames[Math.floor(frames.length * .95)], framesOver34ms: frames.filter(frame => frame > 34).length, frames: frames.length, cls: window.auditShifts, imageBytes: resources.reduce((sum, resource) => sum + resource.encodedBodySize, 0), alanResources: resources.filter(resource => resource.name.includes('alan-')).length };
    });
    results.performance.push({ touch, cpuSlowdown: 4, burst, scrollBurst, ...metrics });
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${output}/${phase}.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
