import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';

const browser = await chromium.launch();
const observations = [];
for (const preventScroll of [false, true]) {
  const page = await browser.newPage({viewport:{width:1440,height:900}});
  await page.goto('http://127.0.0.1:3000/work/aurelia');
  await page.waitForFunction(() => document.querySelector('#aurelia-media')?.dataset.horizontal === 'true');
  await page.evaluate(() => document.fonts.ready);
  const sequence = page.locator('#aurelia-media');
  const y = await sequence.evaluate(el => el.getBoundingClientRect().top + window.scrollY + (el.clientHeight - window.innerHeight) / 2);
  await page.evaluate(y => window.scrollTo(0,y),y);
  await page.waitForFunction(() => document.querySelector('#aurelia-media progress')?.value === 2);
  const before = await page.evaluate(() => ({scrollY:window.scrollY,progress:document.querySelector('#aurelia-media progress').value}));
  await sequence.locator('.case-media-skip').evaluate((el,preventScroll) => el.focus({preventScroll}),preventScroll);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const after = await page.evaluate(() => ({scrollY:window.scrollY,progress:document.querySelector('#aurelia-media progress').value,focused:document.activeElement.className}));
  observations.push({preventScroll,before,after});
  await page.close();
}
await browser.close();
await fs.writeFile('.scratch/website-review/distill/skip-diagnosis.json',JSON.stringify(observations,null,2));
console.log(JSON.stringify(observations));
