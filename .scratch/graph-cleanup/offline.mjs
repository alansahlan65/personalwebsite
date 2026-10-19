import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import crypto from 'node:crypto';

const browser = await chromium.launch({headless:true});
const results = [];
try {
  const context = await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'});
  await context.route(/^https?:/,route=>route.abort());
  for (const file of ['graphify-out/graph.html','public/demos/munchpal/index.html','public/demos/paylecta/index.html']) {
    const page = await context.newPage();
    const errors = [], failed = [];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('requestfailed',request=>failed.push(request.url()));
    await page.goto(pathToFileURL(path.resolve(file)).href+(file.includes('/demos/')?'?clean=1':''));
    let result;
    if(file.startsWith('graphify-out')) {
      await page.waitForSelector('canvas');
      result={file,canvases:await page.locator('canvas').count()};
      await page.screenshot({path:path.resolve('graphify-out/graph-preview.png')});
    } else {
      await page.waitForFunction(()=>window.OPENER?.ready,{timeout:120000});
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));});
      const captures=[];
      for(const time of [5,10,5]) {
        await page.evaluate(async time=>{await window.OPENER.seekFrame(time);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},time);
        captures.push(crypto.createHash('sha256').update(await page.screenshot()).digest('hex'));
      }
      result={file,duration:await page.evaluate(()=>window.OPENER.DURATION),reverseSeekingMatches:captures[0]===captures[2],distinctFrames:captures[0]!==captures[1],brokenImages:await page.evaluate(()=>[...document.images].filter(image=>!image.complete||!image.naturalWidth).map(image=>image.src))};
    }
    results.push({...result,errors,failed});
    await page.close();
  }
  await context.close();
} finally {await browser.close();}
await fs.writeFile('.scratch/graph-cleanup/offline-results.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
if(results.some(result=>result.errors.length||result.failed.length||result.brokenImages?.length||result.reverseSeekingMatches===false))process.exitCode=1;
