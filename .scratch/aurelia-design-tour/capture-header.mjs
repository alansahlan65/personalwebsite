import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const out = path.resolve('.scratch/aurelia-design-tour/header-source');
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, locale: 'en-GB' });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://127.0.0.1:3002', { waitUntil: 'networkidle', timeout: 120000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(2100);
await page.addStyleTag({ content: 'nextjs-portal{display:none!important}' });
async function save(name, selector) {
  const html = await (typeof selector === 'string' ? page.locator(selector) : selector).evaluate(root => {
    const copy = root.cloneNode(true);
    const original = root.querySelectorAll('input,select,textarea');
    copy.querySelectorAll('input,select,textarea').forEach((e, i) => {
      if (e.tagName === 'SELECT') [...e.options].forEach(o => o.toggleAttribute('selected', o.value === original[i].value));
      else if (e.tagName === 'TEXTAREA') e.textContent = original[i].value;
      else { e.setAttribute('value', original[i].value); e.toggleAttribute('checked', original[i].checked); }
    });
    [copy, ...copy.querySelectorAll('*')].forEach(e => {
      if (e.style) ['transform', 'translate', 'scale', 'opacity', 'visibility', 'filter', 'clip-path', 'will-change'].forEach(p => e.style.removeProperty(p));
      if (e.tagName === 'IMG') {
        const u = new URL(e.src, location.href);
        e.src = 'assets/' + (u.searchParams.get('url') || u.pathname).split('/').pop();
        ['srcset','sizes','loading','fetchpriority'].forEach(a => e.removeAttribute(a));
      }
    });
    return copy.outerHTML;
  });
  await fs.writeFile(path.join(out, name + '.html'), html);
  await page.screenshot({ path: path.join(out, name + '.png') });
}
await save('hero', '.hero');
await save('navigation', '.site-header');
await fs.writeFile(path.join(out, 'source-desktop.css'), await page.evaluate(() => {
  function rules(list) {
    return [...list].map(r => r instanceof CSSMediaRule ? (matchMedia(r.conditionText).matches ? rules(r.cssRules) : '') : r.cssText).join('\n');
  }
  return [...document.styleSheets].map(s => { try { return rules(s.cssRules); } catch { return ''; } }).join('\n');
}));
await page.getByRole('link', { name: 'Stays', exact: true }).first().click();
await page.waitForTimeout(1500);
await page.locator('#stays').scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await save('collection', '#stays');
await save('collection-header', '.stays__header');
await save('tirta-card', page.locator('.stay-card').filter({ has: page.getByRole('heading', { name: 'Tirta Forest Villa', exact: true }) }));
await save('neighbor-before', page.locator('.stay-card').filter({ has: page.getByRole('heading', { name: 'Sora Surf Villa', exact: true }) }));
await save('neighbor-after', page.locator('.stay-card').filter({ has: page.getByRole('heading', { name: 'Tegal Quiet Retreat', exact: true }) }));
// Direct card activation is supported even when Tirta is a carousel neighbor.
await page.locator('.stay-card').filter({ has: page.getByRole('heading', { name: 'Tirta Forest Villa', exact: true }) }).getByRole('button', { name: 'View stay', exact: true }).evaluate(e => e.click());
await page.getByRole('dialog').waitFor();
await page.waitForTimeout(600);
await save('property', '.stay-modal-backdrop');
await page.getByRole('button', { name: 'View image 2', exact: true }).click();
await page.waitForTimeout(400);
await save('property-second', '.stay-modal-backdrop');
await page.getByRole('button', { name: 'Check these dates', exact: true }).click();
await page.getByRole('dialog', { name: 'Plan your Bali stay.' }).waitFor();
await page.waitForTimeout(600);
await save('dates-empty', '.drawer-backdrop');
const dialog = page.getByRole('dialog', { name: 'Plan your Bali stay.' });
await dialog.getByLabel('Check-in', { exact: true }).fill('2027-03-09');
await save('arrival', '.drawer-backdrop');
await dialog.getByLabel('Check-out', { exact: true }).fill('2027-03-12');
await save('dates', '.drawer-backdrop');
await dialog.getByRole('button', { name: 'Continue', exact: true }).click();
await save('stay', '.drawer-backdrop');
const preselection = {
  property: await dialog.getByLabel('Preferred stay', { exact: false }).inputValue(),
  area: await dialog.getByLabel('Preferred area', { exact: false }).inputValue(),
  adults: await dialog.getByLabel('Adults', { exact: true }).inputValue(),
};
await dialog.getByRole('button', { name: 'Back', exact: true }).click();
await dialog.getByLabel('Check-out', { exact: true }).fill('2027-03-14');
await save('revised', '.drawer-backdrop');
const retained = await dialog.locator('.booking-context__summary').innerText();
await fs.writeFile(path.join(out, 'validation.json'), JSON.stringify({
  source: 'D:/Project/New Real Estate Landing Page Premium',
  route: ['Stays', 'View stay: Tirta Forest Villa', 'View image 2', 'Check these dates', 'Check-in', 'Check-out', 'Continue', 'Back', 'Check-out'],
  preselection, retained, errors,
  adjustments: ['Photo navigation is View image 2, not Next stay, which changes the property.', 'Date inputs are native browser controls. No source range calendar or nights counter exists.'],
}, null, 2));
console.log(JSON.stringify({ preselection, retained, errors }));
await browser.close();
