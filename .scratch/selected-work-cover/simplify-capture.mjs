import fs from 'node:fs/promises';
import {setTimeout as wait} from 'node:timers/promises';
import {chromium, expect} from '@playwright/test';

const folder='.impeccable/review/selected-work-cover/simplified';
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch();
for(const width of [1440,390]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  await page.goto('http://127.0.0.1:3000/#work');
  await page.mouse.move(0,0);
  await page.evaluate(()=>document.fonts.ready);
  await expect.poll(()=>page.locator('.project-cover').evaluateAll(images=>images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  await wait(400);
  await page.screenshot({path:`${folder}/default-${width}.png`});
  if(width===1440) {
    const row=page.locator('.project-row').first();
    await row.locator('h3').hover();
    await expect(row).toHaveAttribute('data-expanded','true');
    await wait(400);
    await row.evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-90));
    await page.screenshot({path:`${folder}/expanded-${width}.png`});
  }
  console.log(JSON.stringify({width,documentWidth:await page.evaluate(()=>document.documentElement.scrollWidth)}));
  await page.close();
}
await browser.close();
