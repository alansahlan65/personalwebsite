import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const output = path.resolve('.scratch/aurelia-design-tour/capture');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://127.0.0.1:3002/', { waitUntil: 'networkidle', timeout: 120000 });
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: 'nextjs-portal { display:none!important }' });
await page.waitForTimeout(2400);
await page.screenshot({ path: path.join(output, 'hero.png') });
// Visit every section so original reveal layers and lazy photography have settled.
for (const section of await page.locator('main > section, body > footer').all()) {
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
}
await page.evaluate(async () => {
  document.querySelectorAll('img').forEach(i => { i.loading = 'eager'; });
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
});
const clone = async selector => page.locator(selector).evaluate(root => {
  const copy = root.cloneNode(true);
  copy.querySelectorAll('.pin-spacer').forEach(e => e.replaceWith(...e.childNodes));
  [copy, ...copy.querySelectorAll('*')].forEach(e => {
    if (e.style) for (const property of ['transform', 'translate', 'scale', 'opacity', 'visibility', 'filter', 'clip-path', 'will-change']) {
      if (property === 'transform' && (e.classList.contains('stays__track') || e.classList.contains('stays__slide'))) continue;
      e.style.removeProperty(property);
    }
    if (e.tagName === 'IMG') {
      const source = new URL(e.getAttribute('src'), location.href);
      const original = source.searchParams.get('url') || source.pathname;
      e.setAttribute('src', 'assets/' + original.split('/').pop());
      e.removeAttribute('srcset'); e.removeAttribute('sizes'); e.removeAttribute('loading');
      e.removeAttribute('fetchpriority');
    }
  });
  const live = root.querySelectorAll('input,select,textarea');
  copy.querySelectorAll('input,select,textarea').forEach((e, i) => {
    if (e.tagName === 'SELECT') [...e.options].forEach(o => o.toggleAttribute('selected', o.value === live[i].value));
    else if (e.tagName === 'TEXTAREA') e.textContent = live[i].value;
    else { e.setAttribute('value', live[i].value); e.toggleAttribute('checked', live[i].checked); }
  });
  return copy.outerHTML;
});
const snapshot = async (name, selector) => {
  await fs.writeFile(path.join(output, name + '.html'), await clone(selector));
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  await page.screenshot({ path: path.join(output, name + '.png') });
};
await fs.writeFile(path.join(output, 'main.html'), await clone('main'));
await fs.writeFile(path.join(output, 'navigation.html'), await clone('.site-header'));
await fs.writeFile(path.join(output, 'footer.html'), await clone('footer'));
const map = await page.evaluate(() => ({
  sections: [...document.querySelectorAll('main > section, footer')].map(e => ({
    id: e.id, className: e.className, heading: e.querySelector('h1,h2')?.innerText,
    height: e.getBoundingClientRect().height,
    buttons: [...e.querySelectorAll('button')].map(b => ({ text: b.innerText, label: b.getAttribute('aria-label') })),
  })),
  images: [...document.images].map(i => new URL(i.src).searchParams.get('url') || new URL(i.src).pathname),
}));
await snapshot('collection', '#stays');
const next = page.locator('#stays').getByRole('button', { name: /next/i }).first();
await next.click(); await page.waitForTimeout(1200);
const carousel = await page.locator('#stays').evaluate(e => ({
  transforms: [...e.querySelectorAll('[style]')].filter(n => n.style.transform).map(n => ({ className: n.className, transform: n.style.transform })),
  selected: [...e.querySelectorAll('.stay-card')].map(n => n.getAttribute('data-selected')),
}));
await snapshot('collection-next', '#stays');
await snapshot('categories', '#ways-to-stay');
await snapshot('featured', '#featured');
await page.locator('#featured [role=tab]').nth(1).click(); await page.waitForTimeout(1100);
await snapshot('featured-next', '#featured');
await snapshot('areas', '#areas');
await page.locator('#areas').getByRole('tab', { name: /Ubud/ }).click(); await page.waitForTimeout(1200);
await snapshot('areas-ubud', '#areas');
await snapshot('trust', '#standard');
await snapshot('faq', '#faq');
await page.locator('#faq details summary').first().click();
await snapshot('faq-open', '#faq');
await snapshot('cta', '.final-cta');
await snapshot('footer', 'footer');
await page.locator('.final-cta').getByRole('button', { name: /Plan your stay/i }).click();
const dialog = page.getByRole('dialog');
await dialog.waitFor();
await dialog.getByLabel('Check-in', { exact: true }).fill('2027-03-09');
await dialog.getByLabel('Check-out', { exact: true }).fill('2027-03-14');
await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
await dialog.getByLabel('Preferred area').selectOption({ label: 'Ubud' });
await dialog.getByLabel('Preferred stay').selectOption('tirta-forest-villa');
await page.waitForTimeout(1000);
await fs.writeFile(path.join(output, 'planner.html'), await clone('[role=dialog]'));
await page.screenshot({ path: path.join(output, 'planner.png') });
map.images = [...new Set([...map.images, ...await page.evaluate(() => [...document.images].map(i => new URL(i.src).searchParams.get('url') || new URL(i.src).pathname))])];
await fs.writeFile(path.join(output, 'map.json'), JSON.stringify({ ...map, carousel, errors }, null, 2));
console.log(JSON.stringify({ sections: map.sections.map(s => ({ id:s.id, class:s.className, heading:s.heading, height:s.height })), carousel, errors }, null, 2));
await browser.close();
