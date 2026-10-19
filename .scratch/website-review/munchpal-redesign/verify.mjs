import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('.impeccable/review');
const evidencePath = path.resolve('.scratch/website-review/munchpal-redesign');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch();
const samples = [];
const failures = [];
const captures = [];
const pass = process.argv[2] ?? 'initial';
const measure = async (page, width, state) => {
  const sample = await page.evaluate(({ width, state }) => {
    const nodes = [...document.querySelectorAll('main h1, main h2, main h3, #munchpal-research p, #munchpal-revisions p, #munchpal-evaluation p, #munchpal-evaluation dt, #munchpal-evaluation dd, #munchpal-revisions a, main summary')];
    const outside = nodes.filter(e => {
      const r = e.getBoundingClientRect();
      return r.width && (r.left < -1 || r.right > width + 1) && !e.closest('.case-media');
    }).map(e => ({ text: e.textContent, x: e.getBoundingClientRect().x, width: e.getBoundingClientRect().width }));
    const images = [...document.querySelectorAll('#munchpal-revisions img')].map(i => ({ source: i.getAttribute('src'), width: i.naturalWidth, height: i.naturalHeight, renderedWidth: i.getBoundingClientRect().width }));
    return { width, state, viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, outside, images, horizontal: document.querySelector('.case-media').dataset.horizontal, font: getComputedStyle(document.querySelector('h1')).fontFamily };
  }, { width, state });
  samples.push(sample);
  if (sample.documentWidth > width + 1 || sample.outside.length) failures.push(sample);
};
const save = async (page, name, locator, fullPage = false) => {
  if (pass === 'measure-only') return;
  if (pass === 'repair-invalid' && !['mobile-text-200', 'mobile-forced-colors'].includes(name)) return;
  if (pass === 'recapture-chrome' && !locator && !fullPage) return;
  await page.mouse.move(0, 0);
  if (name !== 'mobile-forced-colors') await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
  const target = path.join(output, name + '.png');
  const style = locator || fullPage ? '.skip-link, .compact-menu-trigger, .site-cursor, .site-cursor-arrow { visibility: hidden !important; }' : undefined;
  if (locator) await locator.screenshot({ path: target, animations: 'disabled', style });
  else await page.screenshot({ path: target, fullPage, animations: 'disabled', style });
  captures.push(target);
};
try {
  for (const width of [1440, 1280, 1024, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: width > 700 ? 1000 : 844 }, hasTouch: width < 650, isMobile: width < 650 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:3000/work/munchpal');
    await page.evaluate(() => document.fonts.ready);
    for (const image of await page.locator('main img').all()) {
      if (await image.evaluate(i => !!i.closest('.case-media-panel'))) {
        await image.locator('xpath=ancestor::article').getByRole('link').focus();
      }
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(650);
    await measure(page, width, 'normal');
    if (width === 1440) {
      await save(page, 'desktop');
      await save(page, 'desktop-research', page.locator('#munchpal-research'));
      await save(page, 'desktop-revisions', page.locator('#munchpal-revisions'));
      const sequence = page.locator('#munchpal-media');
      const range = await sequence.evaluate(e => ({ start: e.getBoundingClientRect().top + scrollY, travel: e.getBoundingClientRect().height - innerHeight }));
      for (const [index, panel] of ['flow', 'home', 'feedback'].entries()) {
        await page.evaluate(({ start, travel, index }) => scrollTo(0, start + travel * index / 2), { ...range, index });
        await expect(sequence.getByRole('progressbar')).toHaveAttribute('value', String(index + 1));
        await page.waitForTimeout(100);
        await save(page, 'desktop-' + panel);
      }
      await page.locator('#munchpal-evaluation details summary').click();
      await save(page, 'desktop-evaluation', page.locator('#munchpal-evaluation'));
      await save(page, 'desktop-close', page.locator('section[aria-labelledby="munchpal-next-title"]'));
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForTimeout(100);
      await save(page, 'desktop-content-stacked', null, true);
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
    if (width === 390) {
      await save(page, 'mobile', null, true);
      await save(page, 'mobile-research', page.locator('#munchpal-research'));
      await page.locator('#munchpal-evaluation details summary').click();
      await save(page, 'mobile-evaluation', page.locator('#munchpal-evaluation'));
      await save(page, 'mobile-close', page.locator('section[aria-labelledby="munchpal-next-title"]'));
      for (const [index, article] of (await page.locator('#munchpal-revisions article').all()).entries()) {
        await save(page, 'mobile-revision-' + (index + 1), article);
      }
    }
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await page.locator('#munchpal-evaluation').scrollIntoViewIfNeeded();
    await measure(page, width, 'text-200');
    if (width === 320) await save(page, 'mobile-text-200', page.locator('#munchpal-evaluation'));
    await page.addStyleTag({ content: 'html { font-size: 100%; }' });
    await page.evaluate(() => document.documentElement.dir = 'rtl');
    await measure(page, width, 'rtl');
    if (width === 390) {
      await page.evaluate(() => document.documentElement.dir = 'ltr');
      await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
      const summary = page.locator('details summary');
      await page.keyboard.press('Tab');
      await summary.focus();
      await expect(summary).toHaveCSS('outline-style', 'solid');
      await measure(page, width, 'forced-colors');
      await save(page, 'mobile-forced-colors');
    }
    if (errors.length) failures.push({ width, errors });
    await context.close();
  }
} finally { await browser.close(); }
await fs.writeFile(path.join(evidencePath, `evidence-${pass}.json`), JSON.stringify({ samples, failures, captures }, null, 2) + '\n');
console.log(JSON.stringify({ samples: samples.length, failures, captures: captures.length }, null, 2));
if (failures.length) process.exitCode = 1;
