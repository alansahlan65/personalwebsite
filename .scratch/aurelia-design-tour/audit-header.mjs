import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const records=[];
try { for(const width of [390,1440])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
 await context.addInitScript(theme=>localStorage.setItem('portfolio-theme-v1',theme),theme);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3000/work/aurelia',{waitUntil:'domcontentloaded',timeout:120000});await page.evaluate(()=>document.fonts.ready);
 const video=page.getByLabel('40-second Aurelia product tour');await video.scrollIntoViewIfNeeded();await page.waitForTimeout(450);
 await page.screenshot({path:`.scratch/aurelia-design-tour/review/header-${width}-${theme}.png`});
 records.push({width,theme,errors,...await video.evaluate(v=>({paused:v.paused,currentTime:v.currentTime,poster:v.poster,overflow:document.documentElement.scrollWidth>innerWidth,bounds:JSON.stringify(v.getBoundingClientRect())}))});
 await context.close();
}
await fs.writeFile('.scratch/aurelia-design-tour/review/header-audit.json',JSON.stringify(records,null,2));
console.log(JSON.stringify(records)); } finally { await browser.close(); }
