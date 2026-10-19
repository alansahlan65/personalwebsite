import { chromium } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:960,height:540}});
await page.goto(pathToFileURL(path.resolve('public/demos/aurelia/index.html')).href+'?clean=1');
await page.waitForFunction(()=>window.__tour?.ready);
const output=path.resolve('.scratch/aurelia-design-tour/header-review');
for(const t of [8.18,9.8,19.5,23,29.7]){
  for(const variant of ['first','repeat']){
    if(variant==='repeat')await page.evaluate(()=>window.__tour.seek(0));
    await page.evaluate(t=>window.__tour.seek(t),t);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.screenshot({path:path.join(output,`seek-${t}-${variant}.png`)});
    await fs.writeFile(path.join(output,`seek-${t}-${variant}.json`),JSON.stringify(await page.evaluate(()=>({
      style:[...document.querySelectorAll('[style]')].map(e=>({class:e.className,id:e.id,style:e.getAttribute('style')})),
      summary:document.querySelector('.booking-context__summary').innerHTML,
      progress:document.querySelector('.booking-context nav').innerHTML,
    })),null,2));
  }
}
await browser.close();
console.log('Seek diagnostics saved.');
