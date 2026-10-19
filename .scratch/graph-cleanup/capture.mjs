import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const routes = ['/', '/about', '/contact', '/work/aurelia', '/work/paylecta', '/work/pawfriend', '/work/munchpal'];
async function main() {
  const phase = process.argv[2];
  if (!['before','after'].includes(phase)) throw new Error('Expected before or after');
  const dir = path.resolve('.scratch/graph-cleanup', phase);
  await fs.mkdir(dir, {recursive:true});
  const browser = await chromium.launch({headless:true});
  const results = [];
  try {
    for (const width of [390,1440]) for (const theme of ['light','dark']) {
      const context = await browser.newContext({ viewport:{width,height:900}, reducedMotion:'reduce' });
      await context.addInitScript(value=>localStorage.setItem('portfolio-theme-v1',value),theme);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror',error=>errors.push(error.message));
      for (const route of routes) {
        await page.goto('http://127.0.0.1:3000'+route);
        await page.evaluate(async()=>{
          await document.fonts.ready;
          for(let y=0;y<document.documentElement.scrollHeight;y+=700){window.scrollTo(0,y); await new Promise(resolve=>setTimeout(resolve,20));}
          for (const image of document.images) image.loading='eager';
          await Promise.race([Promise.all([...document.images].map(image=>image.decode().catch(()=>{}))),new Promise(resolve=>setTimeout(resolve,10000))]);
          window.scrollTo(0,0);
        });
        await page.waitForTimeout(200);
        const name = `${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}-${theme}.png`;
        const output = path.join(dir,name);
        await page.screenshot({path:output,fullPage:true,animations:'disabled'});
        const result = {route,width,theme,errors:[...errors],...await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,brokenImages:[...document.images].filter(image=>!image.complete||!image.naturalWidth).map(image=>image.currentSrc)}))};
        if(phase==='after'){
          const a = await sharp(path.resolve('.scratch/graph-cleanup/before',name)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
          const b = await sharp(output).ensureAlpha().raw().toBuffer({resolveWithObject:true});
          result.sameGeometry = JSON.stringify(a.info)===JSON.stringify(b.info);
          result.differentPixels = result.sameGeometry ? 0 : null;
          if (result.sameGeometry && !a.data.equals(b.data)) {
            for (let i=0;i<a.data.length;i+=4) {
              if (a.data[i]!==b.data[i] || a.data[i+1]!==b.data[i+1] || a.data[i+2]!==b.data[i+2] || a.data[i+3]!==b.data[i+3]) ++result.differentPixels;
            }
          }
        }
        results.push(result); errors.length=0;
        console.log(`${phase}: ${name}`);
      }
      await context.close();
    }
  } finally {await browser.close();}
  await fs.writeFile(path.resolve('.scratch/graph-cleanup',phase+'.json'),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify({phase,captures:results.length,errors:results.filter(result=>result.errors.length||result.brokenImages.length||result.scrollWidth>result.width),changed:results.filter(result=>result.sameGeometry===false||result.differentPixels>0)},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1});
