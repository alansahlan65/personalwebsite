import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const out = '.impeccable/review/adapt-polish';
const round = process.argv[2] ?? 'initial';
const layoutOnly = process.argv[3] === '--layout-only';
await fs.mkdir(out, {recursive:true});
const browser = await chromium.launch({headless:true});
const previous = layoutOnly ? JSON.parse(await fs.readFile(`.scratch/website-review/adapt-polish/evidence-${round}.json`, 'utf8')) : null;
const captures = previous?.captures ?? [], samples = previous?.samples.filter(sample=>sample.hero) ?? [], failures = [];
const routes = ['/', '/about', '/contact', '/work/aurelia', '/work/paylecta', '/work/pawfriend', '/work/munchpal'];
const settle = async page => {
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
};
const capture = async (page, name, locator) => {
  const path=`${out}/${name}.png`;
  if(locator) await locator.screenshot({path, style:'.skip-link,.site-header,.compact-menu-rail,.compact-menu-trigger,.site-cursor,.site-cursor-arrow {visibility:hidden !important;}'});
  else await page.screenshot({path});
  captures.push(path);
};
if (!layoutOnly) for(const width of [390,1440]) {
  const context=await browser.newContext({viewport:{width,height:width===390?844:1000},hasTouch:width===390});
  const page=await context.newPage();
  for(const route of routes.filter(r=>r!=='/about')) {
    await page.goto('http://127.0.0.1:3000'+route);
    await settle(page);
    await page.waitForTimeout(900);
    await page.waitForTimeout(850);
    if(route==='/') {
      await capture(page,width===390?'mobile':'desktop');
      samples.push({route,width,...await page.evaluate(()=>({hero:document.querySelector('.hero').getBoundingClientRect().height,workY:document.querySelector('.work').getBoundingClientRect().top,firstProjectY:document.querySelector('.project-row').getBoundingClientRect().top}))});
    } else if(route==='/contact') {
      await capture(page,`contact-${width}`,page.locator('form'));
      await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('Denied for recovery capture');}}}));
      await page.getByRole('textbox',{name:'Your message',exact:true}).fill('I would like to discuss a Product Designer role.\nPlease keep this message while I choose my email app.');
      await page.getByRole('button',{name:'Copy message',exact:true}).click();
      await page.getByRole('textbox',{name:'Message to copy',exact:true}).waitFor();
      await capture(page,`contact-recovery-${width}`,page.locator('form'));
    } else {
      const slug=route.split('/').at(-1);
      const sequence=page.locator('.case-media');
      await page.locator('.case-media-panel-nav a').first().click();
      if(width===390) await sequence.evaluate(el=>scrollTo(0,el.getBoundingClientRect().top+scrollY-92));
      await page.waitForTimeout(250);
      await capture(page,`${slug}-navigation-${width}`);
      const panels=sequence.getByRole('article');
      const indices=width===390?[0,1,2]:[2];
      for(const index of indices) {
        await page.locator('.case-media-panel-nav a').nth(index).click();
        await settle(page);
        await panels.nth(index).getByRole('img').evaluate(async img=>{if(!img.complete) await new Promise(resolve=>img.addEventListener('load',resolve,{once:true}));});
        await capture(page,`${slug}-detail-${index+1}-${width}`,panels.nth(index));
      }
      if(slug==='paylecta' && width===390) {
        await panels.last().locator('summary').click();
        await capture(page,'paylecta-full-source-mobile',panels.last());
        await panels.last().locator('summary').click();
      }
    }
  }
  await page.goto('http://127.0.0.1:3000/');
  await settle(page);
  await page.evaluate(()=>scrollTo(0,700));
  await page.getByRole('button',{name:'Open menu',exact:true}).click();
  await page.locator('[data-phase="open"]').waitFor();
  await capture(page,`menu-${width}`);
  if(width===390) {
    await page.keyboard.press('Escape');
    await page.setViewportSize({width:320,height:568});
    await page.addStyleTag({content:'html{font-size:200%;}'});
    await page.getByRole('button',{name:'Open menu',exact:true}).click();
    await page.locator('[data-phase="open"]').waitFor();
    await capture(page,'menu-320-text-200');
    await page.keyboard.press('Escape');
    await page.goto('http://127.0.0.1:3000/');
    await page.addStyleTag({content:'html{font-size:200%;}'});
    await settle(page);
    await page.waitForTimeout(850);
    await capture(page,'home-320-text-200');
  }
  await context.close();
}

const page=await browser.newPage();
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
for(const [width,height] of [[320,568],[390,844],[768,1024],[1000,900],[1440,1000],[844,390]]) {
  await page.setViewportSize({width,height});
  for(const route of routes) {
    await page.goto('http://127.0.0.1:3000'+route);
    await settle(page);
    await page.waitForTimeout(900);
    for(const text of [100,200]) {
      await page.evaluate(text=>document.documentElement.style.fontSize=`${text}%`,text);
      await settle(page);
      const result=await page.evaluate(()=>({documentWidth:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontFamily,horizontal:document.querySelector('.case-media')?.dataset.horizontal}));
      samples.push({route,width,height,text,...result});
      if(result.documentWidth>width) failures.push({route,width,height,text,...result});
    }
  }
}
if (!layoutOnly) {
await page.setViewportSize({width:390,height:844});
await page.emulateMedia({forcedColors:'active'});
await page.goto('http://127.0.0.1:3000/work/munchpal');
await page.locator('.case-media-panel-nav a').last().click();
await page.locator('.case-media-panel').last().locator('.case-media-crop img').evaluate(img=>img.decode());
await page.locator('.case-media-panel').last().locator('summary').focus();
await page.keyboard.press('Tab');
await page.keyboard.press('Shift+Tab');
await capture(page,'munchpal-forced-colors');
}
await browser.close();
const evidence={round,captures,samples,failures,errors};
await fs.writeFile(`.scratch/website-review/adapt-polish/evidence-${round}.json`,JSON.stringify(evidence,null,2));
console.log(JSON.stringify({round,captures:captures.length,samples:samples.length,failures,errors,hero:samples.filter(s=>s.hero)}));
