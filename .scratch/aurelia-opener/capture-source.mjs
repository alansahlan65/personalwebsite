import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('.scratch/aurelia-opener/capture');
await fs.mkdir(output, {recursive: true});
const browser = await chromium.launch({headless: true});
const context = await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1,locale:'en-GB'});
const page = await context.newPage();
const errors=[]; page.on('pageerror', e=>errors.push(e.message));
await page.goto('http://127.0.0.1:3002/', {waitUntil:'networkidle', timeout:120000});
await page.evaluate(()=>document.fonts.ready);
await page.waitForTimeout(2300);
await page.addStyleTag({content:'nextjs-portal{display:none!important}'});
await page.screenshot({path:path.join(output,'hero.png')});
await fs.writeFile(path.join(output,'hero.html'),await page.locator('.hero').evaluate(e=>e.outerHTML));
await fs.writeFile(path.join(output,'navigation.html'),await page.locator('.site-header').evaluate(e=>e.outerHTML));
await fs.writeFile(path.join(output,'site.json'), JSON.stringify(await page.evaluate(()=>({
 title:document.title, text:document.body.innerText,
 headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({level:e.tagName,text:e.innerText})),
 sections:[...document.querySelectorAll('main section')].map(e=>({id:e.id,label:e.getAttribute('aria-label')})),
 fonts:[...document.fonts].map(f=>({family:f.family,weight:f.weight,status:f.status})),
 images:[...document.images].map(i=>({src:i.src,currentSrc:i.currentSrc,width:i.naturalWidth,height:i.naturalHeight,alt:i.alt})),
 styles:[...document.querySelectorAll('link[rel=stylesheet]')].map(l=>l.href)
})),null,2));
await page.getByRole('button',{name:'Plan your stay',exact:true}).first().click();
await page.getByRole('dialog').waitFor();await page.waitForTimeout(900);
const snap = async name=>{
 await page.screenshot({path:path.join(output,name+'.png')});
 await fs.writeFile(path.join(output,name+'.html'),await page.getByRole('dialog').evaluate(e=>{
   const clone=e.cloneNode(true);
   const original=e.querySelectorAll('input,select,textarea');
   clone.querySelectorAll('input,select,textarea').forEach((node,index)=>{
    const live=original[index];
    if(node.tagName==='SELECT') [...node.options].forEach(o=>o.toggleAttribute('selected',o.value===live.value));
    else if(node.tagName==='TEXTAREA')node.textContent=live.value;
    else {node.setAttribute('value',live.value);node.toggleAttribute('checked',live.checked);}
   });return clone.outerHTML;
 }));
 await fs.writeFile(path.join(output,name+'.txt'),await page.getByRole('dialog').innerText());
};
await snap('dates-empty');
const dialog=page.getByRole('dialog');
await dialog.getByLabel('Check-in',{exact:true}).fill('2027-03-09');
await dialog.getByLabel('Check-out',{exact:true}).fill('2027-03-12');
await snap('dates-filled');
await dialog.getByRole('button',{name:'Continue',exact:true}).click();await page.waitForTimeout(350);
await dialog.getByLabel('Preferred area',{exact:false}).selectOption({label:'Ubud'});
await dialog.getByLabel('Preferred stay',{exact:false}).selectOption('tirta-forest-villa');
await snap('stay');
await dialog.getByRole('button',{name:'Back',exact:true}).click();
const retainedDates={checkIn:await dialog.getByLabel('Check-in',{exact:true}).inputValue(),checkOut:await dialog.getByLabel('Check-out',{exact:true}).inputValue()};
await dialog.getByLabel('Check-out',{exact:true}).fill('2027-03-14');await snap('dates-revised');
await dialog.getByRole('button',{name:'Continue',exact:true}).click();
await dialog.getByRole('button',{name:'Continue',exact:true}).click();await snap('contact-empty');
await dialog.getByLabel('Name',{exact:true}).fill('Alex Morgan');
await dialog.getByLabel('Email',{exact:true}).fill('alex@example.com');
await snap('contact');
await dialog.getByRole('button',{name:'Review my stay plan',exact:true}).click();await page.waitForTimeout(300);await snap('result');
console.log('Local result:',await dialog.innerText());
await fs.writeFile(path.join(output,'site.css'),await page.evaluate(()=>[...document.styleSheets].map(s=>{try{return [...s.cssRules].map(r=>r.cssText).join('\n')}catch{return ''}}).join('\n')));
await fs.writeFile(path.join(output,'flow.json'),JSON.stringify({source:'http://127.0.0.1:3002/',viewport:{width:1920,height:1080},retainedDates,errors,complete:true,result:'Local stay plan prepared. No booking or message sent.'},null,2));
await browser.close();
console.log('Captured source hero and six planning states.');
