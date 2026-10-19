import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const round=process.argv[2]??'before';
const dir=round==='before'?'.scratch/website-review/distill/before':'.impeccable/review/distill';
await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch();
const captures=[], samples=[], errors=[];
for(const width of [390,1440]) {
  const page=await browser.newPage({viewport:{width,height:width===390?844:1000}});
  page.on('pageerror',error=>errors.push(error.message));
  for(const slug of ['aurelia','paylecta','pawfriend','munchpal']) {
    await page.goto(`http://127.0.0.1:3000/work/${slug}`);
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(900);
    samples.push({slug,width,...await page.locator('main').evaluate(el=>({visibleWords:el.innerText.trim().split(/\s+/).length,height:el.getBoundingClientRect().height,documentWidth:document.documentElement.scrollWidth}))});
    const path=`${dir}/${slug}-${width}-top.png`;
    await page.screenshot({path}); captures.push(path);
    const story=page.locator(slug==='munchpal'?'#munchpal-revisions':'.case-media');
    await story.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-90));
    await page.waitForTimeout(100);
    const detailPath=`${dir}/${slug}-${width}-story.png`;
    await page.screenshot({path:detailPath}); captures.push(detailPath);
    if(round!=='before') {
      const shot=async(name,locator)=>{const path=`${dir}/${name}-${width}.png`;await locator.screenshot({path,style:'.skip-link,.site-header,.compact-menu-rail,.compact-menu-trigger,.site-cursor,.site-cursor-arrow{visibility:hidden !important;}'});captures.push(path);};
      if(slug==='munchpal') {
        await shot('munchpal-second-decision',page.locator('#munchpal-revisions article').last());
        await shot('munchpal-result',page.locator('#munchpal-evaluation'));
        if(width===390) {
          await page.getByText('Research notes',{exact:true}).click();
          await shot('munchpal-research-open',page.locator('#munchpal-research'));
          await page.getByText('Test details',{exact:true}).click();
          await shot('munchpal-test-open',page.locator('#munchpal-evaluation'));
        } else {
          await page.getByText('More prototype screens',{exact:true}).click();
          await page.locator('.case-media-panel-nav a').first().click();
          await page.screenshot({path:`${dir}/munchpal-tour-${width}.png`});captures.push(`${dir}/munchpal-tour-${width}.png`);
        }
      } else if(width===390) {
        if(slug==='paylecta') {
          await page.locator('.case-media-panel').last().locator('summary').click();
          await shot('paylecta-source-open',page.locator('.case-media-panel').last());
        } else {
          await page.locator(`#${slug}-implementation`).click();
          await shot(`${slug}-notes-open`,page.locator('.case-support'));
        }
      }
    }
  }
  await page.close();
}
if(round!=='before') {
  const page=await browser.newPage();
  for(const [width,height] of [[320,568],[390,844],[768,1024],[1000,900],[1440,1000],[844,390]]) {
    await page.setViewportSize({width,height});
    for(const slug of ['aurelia','paylecta','pawfriend','munchpal']) {
      await page.goto(`http://127.0.0.1:3000/work/${slug}`);
      await page.evaluate(()=>document.fonts.ready);
      await page.waitForTimeout(400);
      for(const text of [100,200]) {
        await page.evaluate(text=>document.documentElement.style.fontSize=`${text}%`,text);
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        samples.push({slug,width,height,text,documentWidth:await page.evaluate(()=>document.documentElement.scrollWidth)});
      }
    }
  }
  await page.close();
}
await browser.close();
const evidence={round,captures,samples,errors};
await fs.writeFile(`.scratch/website-review/distill/evidence-${round}.json`,JSON.stringify(evidence,null,2));
console.log(JSON.stringify({round,captures:captures.length,samples,errors}));
