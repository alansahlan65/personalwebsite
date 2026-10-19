import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch();
for(const width of [320,390]) {
  const page=await browser.newPage({viewport:{width,height:900},isMobile:true,hasTouch:true});
  await page.goto('http://127.0.0.1:3000/');
  const alan=page.getByRole('button',{name:'Say hello to Alan'});
  await expect(alan.locator('[data-character-part="wave-arm"] img')).toHaveJSProperty('complete',true);
  await alan.evaluate(async el=>Promise.all(el.getAnimations().map(a=>a.finished)));
  await alan.tap();
  await expect(alan).toHaveAttribute('data-greeting','true');
  await page.screenshot({path:`.scratch/alan-hover-refinement/final/greeting-page-${width}.png`});
  const geometry=await alan.evaluate(el=>{
    const art=el.firstElementChild.getBoundingClientRect();
    const bubble=[...el.children].find(child=>child.getAttribute('aria-hidden')==='true'&&child.textContent.includes('Hi!')).getBoundingClientRect();
    // The source head begins 78px down its 1402px transparent canvas.
    return {headTop:art.top+art.height*(78/1402),bubbleBottom:bubble.bottom,viewport:innerWidth,pageWidth:document.documentElement.scrollWidth};
  });
  expect(geometry.bubbleBottom+12).toBeLessThan(geometry.headTop);
  expect(geometry.pageWidth).toBe(geometry.viewport);
  const bubble=alan.locator('span[aria-hidden="true"]').filter({hasText:'Hi! Nice to meet you!'});
  const bubbleBox=await bubble.boundingBox();
  for(const text of ['Based in Indonesia','UI/UX Designer at CADIT, building a component library and UI mockups.']) {
    const textBox=await page.getByText(text,{exact:true}).boundingBox();
    expect(bubbleBox.y+bubbleBox.height<=textBox.y||textBox.y+textBox.height<=bubbleBox.y||bubbleBox.x+bubbleBox.width<=textBox.x||textBox.x+textBox.width<=bubbleBox.x,`greeting overlaps ${text}`).toBe(true);
  }
  console.log(JSON.stringify({width,...geometry}));
  await page.close();
}
await browser.close();
