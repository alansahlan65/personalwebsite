import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require=createRequire('D:/Project/New Real Estate Landing Page Premium/package.json');
const sharp=require('sharp');
const out=path.resolve('.scratch/aurelia-design-tour/header-review');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:960,height:540},recordVideo:{dir:path.join(out,'playback'),size:{width:960,height:540}}});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(path.resolve('public/demos/aurelia/index.html')).href);
await page.waitForFunction(()=>window.__tour?.ready);
await page.evaluate(()=>window.__tour.pause());
const hash=async()=>crypto.createHash('sha256').update(await page.screenshot()).digest('hex');
const states=[];
for(const t of [8.18,9.8,19.5,23,29.7]){
  await page.evaluate(t=>window.__tour.seek(t),t);
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const initial=await hash();
  await page.evaluate(()=>window.__tour.seek(0));
  await page.evaluate(t=>window.__tour.seek(t),t);
  await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  states.push({time:t,identical:initial===await hash()});
}
await page.evaluate(()=>window.__tour.seek(0)); const seamStart=await hash();
await page.evaluate(()=>window.__tour.seek(36)); const seamEnd=await hash();
// Real-time browser playback, rather than frame-by-frame export.
const playback=[];
for(const [start,seconds,label] of [[6.7,10,'signature'],[26,5,'revision'],[34.5,3,'loop']]){
  await page.evaluate(t=>{window.__tour.seek(t);window.__tour.play();window.__frameIntervals=[];window.__sampleId=(window.__sampleId||0)+1;const id=window.__sampleId;let last;function sample(now){if(id!==window.__sampleId)return;if(last)window.__frameIntervals.push(now-last);last=now;if(window.__tour.playing)requestAnimationFrame(sample);}requestAnimationFrame(sample);},start);
  await page.waitForTimeout(seconds*1000);
  playback.push(await page.evaluate(label=>{
    window.__tour.pause();
    const deltas=window.__frameIntervals.slice(2).sort((a,b)=>a-b);
    return {label,time:window.__tour.time,sampledFrames:deltas.length,medianFrameMs:deltas[Math.floor(deltas.length*.5)],p95FrameMs:deltas[Math.floor(deltas.length*.95)]};
  },label));
}
for(const t of [1.4,7.8,10.3,13.15,18.8,19.7,23.5,28.45,29.8,33.5]){
  await page.evaluate(t=>window.__tour.seek(t),t);
  await page.screenshot({path:path.join(out,`header-960-${t.toFixed(2)}.png`)});
}
await page.setViewportSize({width:1920,height:1080});
await page.evaluate(()=>window.__tour.seek(33.5));
const poster=await page.screenshot();
await fs.writeFile(path.join(out,'poster.png'),poster);
await sharp(poster).webp({quality:94}).toFile(path.resolve('public/demos/aurelia/poster.webp'));
await page.close();const video=page.video();
if(video)await video.saveAs(path.join(out,'real-time-review.webm'));
await context.close();
const portfolio=await browser.newPage({viewport:{width:1440,height:1000}});
await portfolio.goto('http://127.0.0.1:3000/work/aurelia');
await portfolio.getByRole('button',{name:'Pause Aurelia product tour'}).waitFor();
await portfolio.getByRole('button',{name:'Pause Aurelia product tour'}).click();
await portfolio.frameLocator('iframe[title="36-second Aurelia product tour"]').locator('body').evaluate(()=>window.__tour.seek(33.5));
await portfolio.getByRole('figure',{name:'Aurelia product tour'}).screenshot({path:path.join(out,'portfolio-header.png')});
const report={offline:true,embeddedWidth:960,states,seamIdentical:seamStart===seamEnd,seamStart,seamEnd,playback,errors};
await fs.writeFile(path.join(out,'final-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report));
await browser.close();
