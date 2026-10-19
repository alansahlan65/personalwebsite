import {chromium} from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});
await page.waitForTimeout(800);
const metadata=[];
for(const route of ['/','/about','/contact','/work/aurelia','/work/paylecta','/work/pawfriend','/work/munchpal']) {
 await page.goto('http://127.0.0.1:3000'+route,{waitUntil:'networkidle'});
 metadata.push(await page.evaluate(()=>({path:location.pathname,title:document.title,twitterTitle:document.querySelector('meta[name="twitter:title"]')?.content,ogTitle:document.querySelector('meta[property="og:title"]')?.content,ogImage:document.querySelector('meta[property="og:image"]')?.content,robots:document.querySelector('meta[name="robots"]')?.content})));
}
await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});await page.waitForTimeout(800);
await page.locator('.primary-nav a[href="/about"]').focus();
const warmStart=Date.now(); await page.keyboard.press('Enter'); await page.waitForURL('**/about'); const warmCommit=Date.now()-warmStart;
await page.waitForTimeout(800);
await page.route('**/contact?*',async route=>{await new Promise(resolve=>setTimeout(resolve,3000));await route.continue();});
await page.locator('.primary-nav a[href="/contact"]').click();await page.waitForTimeout(600);
const delayed=await page.evaluate(()=>({phase:document.querySelector('.route-curtain')?.dataset.phase,pathname:location.pathname,visibleLoadingText:document.body.innerText.includes('Loading'),curtainOpacity:getComputedStyle(document.querySelector('.route-curtain')).opacity}));
await page.waitForURL('**/contact');
const evidence={metadata,warmCommit,delayed};
fs.writeFileSync('.scratch/website-review/root/metadata-navigation.json',JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence));await browser.close();
