// A bounded desktop/phone review of every route in both themes.
async function main() {
  const [{ chromium, expect }, fs] = await Promise.all([import('@playwright/test'), import('node:fs')]);
  const before = process.argv.includes('--before');
  const aboutOnly = process.argv.includes('--about-only');
  const outputIndex = process.argv.indexOf('--output');
  const directory = outputIndex < 0 ? '.impeccable/review/site-themes' : process.argv[outputIndex + 1];
  if (!directory?.startsWith('.impeccable/review/')) throw new Error('Review output must stay under .impeccable/review/.');
  fs.mkdirSync(directory, { recursive: true });
  const browser = await chromium.launch();
  const routes = aboutOnly ? ['/about'] : before ? ['/', '/about'] : ['/', '/about', '/contact', '/work/aurelia', '/work/paylecta', '/work/pawfriend', '/work/munchpal', '/missing-page'];
  const results = [];
  try {
    for (const width of [1440, 390]) {
      for (const theme of before ? ['light'] : ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 }, reducedMotion: 'reduce', colorScheme: 'dark' });
        if (!before) await context.addInitScript(value => localStorage.setItem('portfolio-theme-v1', value), theme);
        for (const route of routes) {
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.goto('http://127.0.0.1:3000' + route);
          if (!before) await expect(page.locator('.site-header').getByRole('switch', { name: 'Dark theme' })).toBeEnabled();
          await page.evaluate(() => document.fonts.ready);
          // Load the naturally lazy media before taking a full-page review capture.
          await page.evaluate(async () => {
            for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight) {
              scrollTo(0, y);
              await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
            }
            // Closed native disclosures can retain image boxes without fetching
            // their lazy sources. Never let those optional images block review.
            await Promise.race([
              Promise.allSettled([...document.images].filter(image => !image.closest('details:not([open])') && image.getClientRects().length).map(image => image.decode())),
              new Promise(resolve => setTimeout(resolve, 5000)),
            ]);
            scrollTo(0, 0);
          });
          await expect(page.locator('.site-header')).toHaveCSS('opacity', '1');
          await expect(page.locator('.compact-menu-rail')).toBeHidden();
          const slug = route === '/' ? 'home' : route.replaceAll('/', '-').slice(1);
          await page.screenshot({ path: `${directory}/${before ? 'before' : 'after'}-${slug}-${width}-${theme}.png`, fullPage: true });
          const metrics = await page.evaluate(() => {
            const root = document.documentElement;
            const css = getComputedStyle(root);
            return { canvas: css.getPropertyValue('--canvas').trim(), ink: css.getPropertyValue('--ink').trim(), overflow: root.scrollWidth - innerWidth, scheme: css.colorScheme };
          });
          results.push({ route, width, theme, ...metrics, errors });
          await page.close();
        }
        if (process.argv.includes('--components')) {
          const page = await context.newPage();
          await page.emulateMedia({ reducedMotion: 'no-preference' });
          await page.goto('http://127.0.0.1:3000/about');
          await expect(page.locator('.site-header').getByRole('switch', { name: 'Dark theme' })).toBeEnabled();
          await page.evaluate(() => document.fonts.ready);
          if ((width === 1440 && theme === 'light') || (width === 390 && theme === 'dark')) {
            const experiment = page.locator('[data-experiment]');
            if (await experiment.count()) {
              await experiment.scrollIntoViewIfNeeded();
              await page.mouse.move(0, 0);
              await page.evaluate(() => Promise.allSettled(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished)));
              await experiment.screenshot({ path: `${directory}/experiment-${width}-${theme}.png` });
              await experiment.getByRole('button', { name: 'Save a favorite' }).click();
              await expect(experiment.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true');
              await page.mouse.move(0, 0);
              await expect.poll(() => experiment.locator('[data-control-visual]').evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m11 - 1))).toBeLessThan(.001);
              await page.evaluate(() => Promise.allSettled(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity).map(animation => animation.finished)));
              await experiment.screenshot({ path: `${directory}/experiment-saved-${width}-${theme}.png` });
            }
          }
          const notebook = page.locator('[data-notebook]');
          await notebook.scrollIntoViewIfNeeded();
          await page.getByRole('button', { name: 'Reveal answer', exact: true }).click();
          const answer = notebook.locator('[data-front] p').filter({ hasText: 'Both. I love Marvel and DC.' });
          await expect(answer).toBeVisible();
          await expect.poll(() => notebook.locator('[data-front]').evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m41))).toBeLessThan(1);
          // Let the slide settle; this evidence intentionally retains normal motion and card layering.
          await expect.poll(() => answer.evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node.parentElement).transform).m42))).toBeLessThan(.1);
          await page.mouse.move(0, 0);
          await notebook.screenshot({ path: `${directory}/notebook-${width}-${theme}.png` });
          if ((width === 1440 && theme === 'light') || (width === 390 && theme === 'dark')) {
            const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
            await expect(trigger).toHaveCSS('transform', 'none');
            await page.locator('.compact-menu-rail').screenshot({ path: `${directory}/compact-${width}-${theme}.png` });
            await page.getByRole('button', { name: 'Open menu', exact: true }).click();
            const menu = page.getByRole('dialog', { name: 'Navigation menu' });
            await expect(menu).toHaveAttribute('data-phase', 'open');
            await page.screenshot({ path: `${directory}/menu-${width}-${theme}.png` });
          }
          await page.close();
        }
        await context.close();
      }
    }
    const metricsFile = `${directory}/${before ? 'before' : 'after'}-metrics.json`;
    const previous = aboutOnly && fs.existsSync(metricsFile) ? JSON.parse(fs.readFileSync(metricsFile, 'utf8')).filter(row => row.route !== '/about') : [];
    fs.writeFileSync(metricsFile, JSON.stringify([...previous, ...results], null, 2));
    console.log(JSON.stringify(results, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
