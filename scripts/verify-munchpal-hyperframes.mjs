import { chromium } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import os from 'node:os';

const project=path.resolve('public/demos/munchpal-opener');
const output=path.resolve('.scratch/munchpal-opener/qa');
await fs.mkdir(output,{recursive:true});
const browserCache=path.join(os.homedir(),'AppData/Local/ms-playwright');
const installed=(await fs.readdir(browserCache).catch(()=>[])).filter(n=>/^chromium-\d+$/.test(n)).sort((a,b)=>Number(b.split('-')[1])-Number(a.split('-')[1]));
const executable=process.env.MUNCHPAL_CHROME || (process.platform==='win32'&&installed.length?path.join(browserCache,installed[0],'chrome-win64/chrome.exe'):chromium.executablePath());
const browser=await chromium.launch({headless:true,executablePath:executable});
try {
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{if(/GSAP target .+ not found/.test(message.text()))errors.push(message.text());});
  await page.goto(pathToFileURL(path.join(project,'index.html')).href+'?clean=1');
  await page.waitForFunction(()=>window.OPENER?.ready);
  const duration=await page.evaluate(()=>window.OPENER.DURATION);
  const times=[0,1.8,3.6,5.2,6.4,7,10,11.8,13.28,15,17,19.3,21.32,23.3,24.4,26.5,28.6,30.42,32.8,35.5,38.5,duration];
  const frames=[];
  for(const time of times){
    await page.evaluate(t=>window.OPENER.seekFrame(t),time);
    const bytes=await page.screenshot();
    const filename=path.join(output,`frame-${String(time).replace('.','-')}.png`);
    await fs.writeFile(filename,bytes);
    frames.push({time,bytes});
  }
  const cards=await Promise.all(frames.map(async ({time,bytes})=>{
    const thumb=await sharp(bytes).resize(640,360).toBuffer();
    const label=Buffer.from(`<svg width="640" height="32"><rect width="640" height="32" fill="#fffdfa"/><text x="16" y="22" font-family="Arial" font-size="18" fill="#1c1c1e">${time.toFixed(2)} s</text></svg>`);
    return sharp({create:{width:640,height:392,channels:3,background:'#fffdfa'}}).composite([{input:thumb,top:0,left:0},{input:label,top:360,left:0}]).png().toBuffer();
  }));
  await sharp({create:{width:1920,height:Math.ceil(cards.length/3)*392,channels:3,background:'#fffdfa'}}).composite(cards.map((input,i)=>({input,left:(i%3)*640,top:Math.floor(i/3)*392}))).png().toFile(path.join(output,'contact-sheet.png'));
  const taps=[];
  for(const [time,selector,tap] of [[10.42,'#request-action','#tap-request'],[13.28,'#send-request','#tap-confirm'],[21.32,'#send-message','#tap-message'],[30.42,'#view-report','#tap-report']]){
    await page.evaluate(t=>window.OPENER.seekFrame(t),time);
    taps.push(await page.evaluate(({time,selector,tap})=>{const a=document.querySelector(selector).getBoundingClientRect(),b=document.querySelector(tap).getBoundingClientRect();const x=b.x+b.width/2,y=b.y+b.height/2;return {time,selector,target:{x:a.x,y:a.y,width:a.width,height:a.height},tap:{x,y},hits:x>=a.x&&x<=a.right&&y>=a.y&&y<=a.bottom};},{time,selector,tap}));
  }
  const comparisons=[];
  const styles=()=>page.evaluate(()=>Object.fromEntries(Array.from(document.querySelectorAll('[id]')).map(el=>{const s=getComputedStyle(el);return [el.id,[s.transform,s.opacity,s.boxShadow,s.filter].join('|')]})));
  for(const time of [0,3.6,5.2,11.8,17,24.4,35.5]){
    await page.evaluate(t=>window.OPENER.seekFrame(t),time);const forward=await page.screenshot();const before=await styles();
    await page.evaluate(()=>window.OPENER.seekFrame(39.5));await page.evaluate(t=>window.OPENER.seekFrame(t),time);const reverse=await page.screenshot();const after=await styles();
    const a=await sharp(forward).raw().toBuffer(),b=await sharp(reverse).raw().toBuffer();
    let maxDelta=0,changed=0;for(let i=0;i<a.length;i++){const d=Math.abs(a[i]-b[i]);maxDelta=Math.max(maxDelta,d);if(d>1)changed++;}
    comparisons.push({time,identical:forward.equals(reverse),maxDelta,changedChannels:changed});
    if(maxDelta>1){await fs.writeFile(path.join(output,`reverse-${time}-before.png`),forward);await fs.writeFile(path.join(output,`reverse-${time}-after.png`),reverse);console.log('Style differences',Object.keys(before).filter(k=>before[k]!==after[k]).map(k=>({id:k,before:before[k],after:after[k]})));}
  }
  const start=await sharp(frames[0].bytes).raw().toBuffer(),end=await sharp(frames.at(-1).bytes).raw().toBuffer();
  let changed=0,maxDelta=0;for(let i=0;i<start.length;i++){const d=Math.abs(start[i]-end[i]);if(d>1)changed++;maxDelta=Math.max(maxDelta,d);}
  const report={duration,errors,taps,reverseSeek:comparisons,loop:{changedChannels:changed,maxDelta},fonts:await page.evaluate(()=>document.fonts.check('500 96px Rubik'))};
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(pathToFileURL(path.join(project,'index.html')).href);
  await page.waitForFunction(()=>window.OPENER?.ready);
  report.reducedMotion=await page.evaluate(()=>({paused:window.OPENER.tl.paused(),time:window.OPENER.tl.time(),controlsHidden:getComputedStyle(document.querySelector('#review-controls')).display==='none'}));
  await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(report,null,2));
  await sharp(frames[0].bytes).webp({quality:94}).toFile(path.join(project,'poster.webp'));
  console.log(JSON.stringify(report,null,2));
  if(errors.length||taps.some(t=>!t.hits)||comparisons.some(c=>c.maxDelta>1)||maxDelta>1||!report.fonts||!report.reducedMotion.paused||report.reducedMotion.time!==0)throw new Error('MunchPal opener verification failed; inspect verification.json.');
} finally { await browser.close(); }
