import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';

const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('http://127.0.0.1:3000/work/aurelia');
await page.keyboard.press('Tab');
const sequence = page.locator('#aurelia-media');
const skip = sequence.locator('.case-media-skip');
const progress = sequence.getByRole('progressbar');
await expect(sequence).toHaveAttribute('data-horizontal','true');
const observations = [];
async function capture(name) {
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport({ratio:1});
  await page.screenshot({path:`.impeccable/review/distill/${name}.png`});
  observations.push({name,...await page.evaluate(() => {
    const skip=document.querySelector('#aurelia-media .case-media-skip');
    return {width:innerWidth,height:innerHeight,focus:document.activeElement===skip,progress:document.querySelector('#aurelia-media progress').value,horizontal:document.querySelector('#aurelia-media').dataset.horizontal,skipBounds:skip.getBoundingClientRect().toJSON()};
  })});
}
const y = await sequence.evaluate(el => el.getBoundingClientRect().top + scrollY + (el.clientHeight-innerHeight)/2);
await page.evaluate(y => window.scrollTo(0,y),y);
await expect(progress).toHaveAttribute('value','2');
await skip.focus();
await expect(progress).toHaveAttribute('value','2');
await capture('skip-fix-1440');
await page.setViewportSize({width:390,height:844});
await expect(sequence).toHaveAttribute('data-horizontal','false');
await capture('skip-fix-390');
await page.setViewportSize({width:1440,height:900});
await expect(sequence).toHaveAttribute('data-horizontal','true');
await expect(progress).toHaveAttribute('value','2');
await page.emulateMedia({reducedMotion:'reduce'});
await expect(sequence).toHaveAttribute('data-horizontal','false');
await capture('skip-fix-reduced-1440');
await page.keyboard.press('Enter');
await expect(page.locator('#aurelia-implementation')).toBeFocused();
await browser.close();
await fs.writeFile('.scratch/website-review/distill/skip-correction-evidence.json',JSON.stringify(observations,null,2));
console.log('Three focused-skip captures; focus, middle progress, full visibility and activation verified.');
