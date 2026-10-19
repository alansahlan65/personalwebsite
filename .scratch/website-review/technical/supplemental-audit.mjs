import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const dir=path.resolve('.scratch/website-review/technical');
const base='http://127.0.0.1:3000';
const routes=['/','/about','/contact','/work/aurelia','/work/paylecta','/work/pawfriend','/work/munchpal'];
const report={started:new Date().toISOString(),overlayServer:{pid:20004,port:8400,stopMethod:'Stop-Process -Id 20004'},overlays:[],textResize:[],motion:[],touch:[]};
const browser=await chromium.launch({headless:true});
try{
const context=await browser.newContext({viewport:{width:1440,height:900}});
for(const route of ['/','/about','/contact','/work/aurelia','/work/paylecta']){
  const page=await context.newPage(),logs=[];
  page.on('console',m=>{if(m.text().toLowerCase().includes('impeccable'))logs.push({type:m.type(),text:m.text()});});
  const entry={route};
  try{await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>{document.title='[Human] Assessment B';scrollTo(0,0);});await page.addScriptTag({url:'http://localhost:8400/detect.js'});await page.waitForTimeout(2500);entry.injected=true;entry.overlayDOM=await page.evaluate(()=>({title:document.title,scripts:[...document.scripts].map(s=>s.src).filter(s=>s.includes('detect.js')),markers:[...document.querySelectorAll('*')].filter(e=>(e.id+' '+e.className).includes('impeccable')).map(e=>({tag:e.tagName,id:e.id,class:String(e.className)})).slice(0,25)}));await page.screenshot({path:path.join(dir,`overlay-${route==='/'?'home':route.slice(1).replaceAll('/','-')}.png`)});}catch(e){entry.error=e.message;}
  entry.logs=logs;report.overlays.push(entry);fs.writeFileSync(path.join(dir,'supplemental-results.json'),JSON.stringify(report,null,2));await page.close();
}
await context.close();
for(const width of [390,1440]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 for(const route of routes){const page=await context.newPage();await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.documentElement.style.fontSize='200%');await page.waitForTimeout(200);report.textResize.push(await page.evaluate(()=>({route:location.pathname,width:innerWidth,documentWidth:document.documentElement.scrollWidth,overflows:[...document.querySelectorAll('main *')].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&!e.closest('[aria-hidden=true]')&&(r.right>innerWidth+1||r.left< -1);}).slice(0,8).map(e=>({tag:e.tagName,class:String(e.className),text:e.textContent.trim().slice(0,70),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right}))})));await page.screenshot({path:path.join(dir,`text-200-${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}.png`),fullPage:true});await page.close();}await context.close();
}
const motionContext=await browser.newContext({viewport:{width:1440,height:900}});
for(const route of routes.filter(r=>r.startsWith('/work/'))){const page=await motionContext.newPage();await page.goto(base+route,{waitUntil:'networkidle'});await page.waitForTimeout(200);const info=await page.locator('.case-media').evaluate(e=>({horizontal:e.dataset.horizontal,travel:getComputedStyle(e).getPropertyValue('--media-travel'),panels:e.querySelectorAll('.case-media-panel').length}));const last=page.locator('.case-media-panel').last().getByRole('link');await last.focus();await page.waitForTimeout(100);info.focusLast=await last.evaluate(e=>({visible:e.getBoundingClientRect().left>=0&&e.getBoundingClientRect().right<=innerWidth,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom,scrollY}));await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(200);info.reducedAfter=await page.locator('.case-media').evaluate(e=>({horizontal:e.dataset.horizontal,trackTransform:getComputedStyle(e.querySelector('.case-media-track')).transform,focusedPanelVisible:document.activeElement.getBoundingClientRect().top>=0&&document.activeElement.getBoundingClientRect().bottom<=innerHeight}));report.motion.push({route,...info});await page.close();}await motionContext.close();
const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
for(const route of routes.filter(r=>r.startsWith('/work/'))){const page=await touchContext.newPage();await page.goto(base+route,{waitUntil:'networkidle'});const skip=page.locator('.case-media-controls a');await skip.tap();await page.waitForTimeout(120);report.touch.push(await page.evaluate(()=>({route:location.pathname,hash:location.hash,focus:document.activeElement.id,scrollY,targetTop:document.querySelector(location.hash)?.getBoundingClientRect().top,horizontal:document.querySelector('.case-media')?.dataset.horizontal})));await page.close();}await touchContext.close();
}finally{report.finished=new Date().toISOString();fs.writeFileSync(path.join(dir,'supplemental-results.json'),JSON.stringify(report,null,2));await browser.close();}
console.log(JSON.stringify({overlays:report.overlays.map(e=>({route:e.route,injected:e.injected,logs:e.logs})),textResize:report.textResize.filter(e=>e.documentWidth>e.width),motion:report.motion,touch:report.touch},null,2));
