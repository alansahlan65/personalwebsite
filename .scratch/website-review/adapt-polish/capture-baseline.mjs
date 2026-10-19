import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const out = '.scratch/website-review/adapt-polish/before';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({headless:true});
const samples = [];
for (const width of [390,1440]) {
  const page = await browser.newPage({viewport:{width,height:width===390?844:1000}});
  for (const route of ['/', '/work/paylecta', '/work/munchpal', '/contact']) {
    await page.goto('http://127.0.0.1:3000'+route);
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(850);
    samples.push({width,route,...await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth,
      hero:document.querySelector('.hero')?.getBoundingClientRect().height,
      workY:document.querySelector('.project-row')?.getBoundingClientRect().top,
      menu:document.querySelector('.compact-menu-trigger')?.getBoundingClientRect().toJSON(),
    }))});
    const name=route==='/'?'home':route.split('/').at(-1);
    await page.screenshot({path:`${out}/${name}-${width}.png`});
    if(route.includes('/work/')) {
      const media=page.locator('.case-media');
      await media.evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY));
      await page.waitForTimeout(200);
      await page.screenshot({path:`${out}/${name}-media-${width}.png`});
    }
  }
  await page.close();
}
await browser.close();
await fs.writeFile(`${out}/metrics.json`,JSON.stringify(samples,null,2));
console.log(JSON.stringify(samples));
