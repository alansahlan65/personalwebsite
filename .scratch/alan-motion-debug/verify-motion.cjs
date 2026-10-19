// Diagnostic browser captures for the reported transition flicker.
const out = 'C:/Users/DESKTOP-IOT0021/.codex/visualizations/2026/10/01/01a0f526-4b45-7362-a5c0-a545d2a9003d';

(async () => {
  const { chromium } = await import('playwright');
  const fs = await import('node:fs/promises');
  const { default: sharp } = await import('sharp');
  const crypto = await import('node:crypto');
  const browser = await chromium.launch({headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:3000/');
  const alan = page.getByRole('button',{name:'Say hello to Alan'});
  await page.waitForFunction(() => document.querySelector('[aria-label="Say hello to Alan"]').dataset.greetingHeadReady === 'true');
  await page.waitForTimeout(900);
  const after = await alan.screenshot({animations:'allow',path:out+'/alan-default-after-flicker-fix.png'});
  const before = await fs.readFile(out+'/alan-default-before-hover-rework.png');
  const a = await sharp(after).raw().toBuffer({resolveWithObject:true});
  const b = await sharp(before).raw().toBuffer({resolveWithObject:true});
  let changed = 0, max = 0;
  if (a.data.length === b.data.length) for (let i=0;i<a.data.length;i++) {const d=Math.abs(a.data[i]-b.data[i]);if(d)changed++;max=Math.max(max,d);}
  console.log({defaultByteIdentical:before.equals(after),defaultPixelsChanged:changed,maxChannelDifference:max,beforeDimensions:b.info,afterDimensions:a.info,hash:crypto.createHash('sha256').update(after).digest('hex')});
  const box = await alan.boundingBox();
  const center = {x:box.x+box.width*.5,y:box.y+box.height*.26};
  for (let index=0;index<24;index++) {
    const angle=index*135*Math.PI/180,radius=index%3===0?300:110;
    await page.mouse.move(center.x+Math.cos(angle)*radius,center.y+Math.sin(angle)*radius);
    await page.waitForTimeout(30);
    await alan.screenshot({animations:'allow',path:out+`/alan-flicker-fixed-${String(index).padStart(2,'0')}.png`});
  }
  await page.mouse.move(-1,-1); await page.waitForTimeout(600);
  await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
  const axe = await page.evaluate(async () => (await axe.run(document)).violations.map(v=>({id:v.id,nodes:v.nodes.length})));
  console.log({errors,axe});
  await browser.close();
})();
