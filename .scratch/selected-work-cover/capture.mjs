import fs from 'node:fs/promises';
import {setTimeout as wait} from 'node:timers/promises';
import {chromium,expect} from '@playwright/test';

const round=process.argv[2] ?? 'initial';
const resume=process.argv[3]==='resume';
const folder=round==='before'?'.scratch/selected-work-cover/before':`.impeccable/review/selected-work-cover/${round}`;
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch();
const captures=resume?(await fs.readdir(folder)).filter(name=>name.endsWith('.png')).map(name=>`${folder}/${name}`):[];
const metrics=[];
const errors=[];
async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.locator('.project-preview img').evaluateAll(images => images.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);
  await wait(400);
}
async function capture(page,name) {
  const path=`${folder}/${name}.png`;
  await page.screenshot({path});captures.push(path);
}
for (const width of resume?[]:[1440,719,390]) {
  const page=await browser.newPage({viewport:{width,height:1000}});
  page.on('pageerror',error=>errors.push({width,message:error.message}));
  await page.goto('http://127.0.0.1:3000/#work');
  await page.mouse.move(0,0);await settle(page);
  await capture(page,`default-${width}`);
  if(width>700) {
    for(const slug of width===1440?['aurelia','paylecta','pawfriend','munchpal']:['aurelia']) {
      const row=page.locator(`[data-project="${slug}"]`);
      await row.locator('h3').hover();await expect(row).toHaveAttribute('data-expanded','true');await settle(page);
      await row.evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-90));
      await capture(page,`${slug}-expanded-${width}`);
      metrics.push({slug,width,...await row.evaluate(el=>{
        const image=el.querySelector('.project-preview-media');const desc=el.querySelector('.project-description');
        const r=image.getBoundingClientRect();const style=desc&&getComputedStyle(desc);
        return {imageWidth:r.width,imageHeight:r.height,description:desc?.textContent,descriptionSize:style?.fontSize,lineHeight:style?.lineHeight,documentWidth:document.documentElement.scrollWidth};
      })});
      await page.mouse.move(0,0);await settle(page);
    }
  }
  await page.close();
}
if(round!=='before') {
  for(const state of resume?['no-js']:['keyboard','reduced','touch-wide','no-js']) {
    const context=await browser.newContext({viewport:{width:state==='no-js'?390:1440,height:1000},hasTouch:state==='touch-wide',isMobile:state==='touch-wide',javaScriptEnabled:state!=='no-js',reducedMotion:state==='reduced'?'reduce':'no-preference'});
    const page=await context.newPage();await page.goto('http://127.0.0.1:3000/#work');await settle(page);
    if(state==='keyboard') {await page.keyboard.press('Tab');await page.locator('.project-link').first().focus();}
    if(state==='reduced') await page.locator('.project-row h3').first().hover();
    if(state==='keyboard'||state==='reduced') await page.locator('.project-row').first().evaluate(el=>window.scrollTo(0,el.getBoundingClientRect().top+scrollY-90));
    await settle(page);
    await capture(page,`${state}`);await context.close();
  }
  for(const width of [320,390,719,900,1024,1440]) for(const text of [100,200]) {
    const page=await browser.newPage({viewport:{width,height:900}});await page.goto('http://127.0.0.1:3000/#work');
    if(text===200) await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    await settle(page);
    if(width>700) {await page.keyboard.press('Tab');await page.locator('.project-link').first().focus();}
    metrics.push({width,text,documentWidth:await page.evaluate(()=>document.documentElement.scrollWidth)});await page.close();
  }
}
await browser.close();
await fs.writeFile(`.scratch/selected-work-cover/evidence-${round}.json`,JSON.stringify({round,captures,metrics,errors},null,2));
console.log(JSON.stringify({round,captures:captures.length,errors,overflow:metrics.filter(sample=>sample.documentWidth>sample.width)}));
