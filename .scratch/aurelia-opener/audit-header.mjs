import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const records=[];
for(const width of [390,1440])for(const theme of ['light','dark']){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},reducedMotion:'reduce'});
 await context.addInitScript(theme=>localStorage.setItem('portfolio-theme-v1',theme),theme);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3001/work/aurelia');await page.evaluate(()=>document.fonts.ready);
 const video=page.getByLabel('26-second Aurelia product tour');await video.scrollIntoViewIfNeeded();await page.waitForTimeout(450);
 await page.addScriptTag({path:'.scratch/runtime/about-story-axe.js'});
 const violations=await page.evaluate(async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));});
 const layout=await page.evaluate(()=>{const v=document.querySelector('video[aria-label="26-second Aurelia product tour"]'),r=v.getBoundingClientRect();return{documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,videoWidth:r.width,videoHeight:r.height,ratio:r.width/r.height,paused:v.paused,poster:v.poster,theme:document.documentElement.dataset.theme}});
 await page.screenshot({path:`.scratch/aurelia-opener/review/header-${width}-${theme}.png`});
 records.push({width,theme,layout,violations,errors});await context.close();
}
await browser.close();await fs.writeFile('.scratch/aurelia-opener/review/header-audit.json',JSON.stringify(records,null,2));
console.log(JSON.stringify(records.map(r=>({width:r.width,theme:r.theme,ratio:r.layout.ratio,overflow:r.layout.documentWidth>r.width,violations:r.violations,errors:r.errors}))));
if(records.some(r=>r.errors.length||r.violations.length||r.layout.documentWidth>r.width||Math.abs(r.layout.ratio-16/9)>.01))process.exitCode=1;
