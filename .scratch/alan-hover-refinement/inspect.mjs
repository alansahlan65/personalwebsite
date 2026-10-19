import fs from 'node:fs/promises';
import {setTimeout as wait} from 'node:timers/promises';
import {chromium,expect} from '@playwright/test';

const phase=process.argv[2]??'before';
const folder=`.scratch/alan-hover-refinement/${phase}`;
await fs.mkdir(folder,{recursive:true});
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:3000/');
// Isolate character pixels from the site's animated pointer overlay.
await page.addStyleTag({content:'.site-cursor,.site-cursor-arrow{display:none!important}'});
const character=page.getByRole('button',{name:'Say hello to Alan'});
await expect(character).toHaveAttribute('data-head-ready','true');
await expect(character).toHaveAttribute('data-greeting-head-ready','true');
await page.evaluate(()=>document.fonts.ready);
await wait(800);
await page.mouse.move(0,0);
await wait(550);
const box=await character.boundingBox();
await character.screenshot({path:`${folder}/rest.png`,animations:'allow'});
for(const time of [60,150,280,500]) {
  await character.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.finish()));
  await page.mouse.move(0,0);await wait(550);
  await page.mouse.move(box.x+box.width*.8,box.y+box.height*.55);
  await expect(character).toHaveAttribute('data-greeting','true');
  const animations=await character.evaluate(el=>{
    const active=el.getAnimations({subtree:true});
    return active.map(a=>{a.pause();return {id:a.id,kind:a.constructor.name,duration:a.effect.getTiming().duration};});
  });
  await character.evaluate((el,time)=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=time;}),time);
  await character.screenshot({path:`${folder}/hover-${time}.png`,animations:'allow'});
  console.log(JSON.stringify({time,animations}));
}
await character.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.finish()));
await page.mouse.move(0,0);
await expect(character).toHaveAttribute('data-greeting','false');
await character.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=60;}));
await character.screenshot({path:`${folder}/exit-60.png`,animations:'allow'});
await character.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.finish()));
await page.mouse.move(0,0);await wait(300);
await page.keyboard.press('Tab');
await character.focus();
await character.screenshot({path:`${folder}/keyboard.png`,animations:'allow'});
for(const width of [719,390]) {
  const mobile=await browser.newPage({viewport:{width,height:900},isMobile:width===390,hasTouch:width===390});
  await mobile.goto('http://127.0.0.1:3000/');
  const alan=mobile.getByRole('button',{name:'Say hello to Alan'});
  // Touch mounts only the front images; directional readiness is unnecessary.
  if(width!==390)await expect(alan).toHaveAttribute('data-head-ready','true');
  await expect(alan.locator('[data-character-part="wave-arm"] img')).toHaveJSProperty('complete',true);
  await wait(800);
  await mobile.screenshot({path:`${folder}/home-${width}.png`});
  if(width===390)await alan.tap();else await alan.hover();
  await wait(300);
  await alan.screenshot({path:`${folder}/greeting-${width}.png`});
  await mobile.close();
}
await browser.close();
