import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve('.scratch/website-review/technical');
const root = 'http://127.0.0.1:3000';
const routes = ['/', '/about', '/contact', '/work/aurelia', '/work/paylecta', '/work/pawfriend', '/work/munchpal'];
const widths = [320, 390, 768, 1440];
(async () => {
  const browser = await chromium.launch({headless:true});
  const report = {started:new Date().toISOString(), browser:browser.version(), matrix:[], interactions:{}, failures:[]};
  try {
    for (const width of widths) {
      const context = await browser.newContext({viewport:{width,height:900}, reducedMotion:'reduce'});
      for (const route of routes) {
        const page = await context.newPage();
        const errors = [], badResponses=[], failedRequests=[];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {if(response.status()>=400) badResponses.push({url:response.url(),status:response.status()});});
        page.on('requestfailed', request => failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
        const result={width,route};
        try {
          const response=await page.goto(root+route,{waitUntil:'networkidle',timeout:45000});
          result.status=response.status();
          await page.evaluate(async () => {
            await document.fonts.ready;
            for(let y=0; y<document.documentElement.scrollHeight; y+=700) {scrollTo(0,y);await new Promise(r=>setTimeout(r,45));}
            scrollTo(0,0);
          });
          await page.waitForTimeout(250);
          result.dom=await page.evaluate(()=>{
            const visible=e=>{const s=getComputedStyle(e), r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0&&!e.closest('[inert],[aria-hidden="true"]');};
            const controls=[...document.querySelectorAll('a[href],button,input,select,textarea')].filter(visible);
            return {
              title:document.title, lang:document.documentElement.lang, viewport:innerWidth, documentWidth:document.documentElement.scrollWidth,
              mainCount:document.querySelectorAll('main').length,
              headings:[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e=>({tag:e.tagName,text:e.textContent.trim()})),
              images:[...document.images].map(e=>({src:e.getAttribute('src'),alt:e.getAttribute('alt'),complete:e.complete,naturalWidth:e.naturalWidth,loading:e.loading})),
              fonts:[...document.fonts].map(f=>({family:f.family,status:f.status})), bodyFont:getComputedStyle(document.body).fontFamily,
              smallControls:controls.map(e=>({tag:e.tagName,text:(e.getAttribute('aria-label')||e.textContent||e.getAttribute('name')||'').trim().slice(0,120),href:e.getAttribute('href'),rect:{w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}})).filter(e=>e.rect.w<44||e.rect.h<44),
              unlabeledControls:controls.filter(e=>['INPUT','TEXTAREA','SELECT','BUTTON'].includes(e.tagName)&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')&&!e.textContent.trim()&&!(e.labels&&e.labels.length)).map(e=>e.outerHTML.slice(0,250)),
              links:controls.filter(e=>e.tagName==='A').map(e=>({text:(e.getAttribute('aria-label')||e.textContent).trim(),href:e.getAttribute('href')})),
              overflow:[...document.querySelectorAll('main *')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1||r.left< -1;}).slice(0,12).map(e=>({tag:e.tagName,class:e.className,text:e.textContent.trim().slice(0,70),left:e.getBoundingClientRect().left,right:e.getBoundingClientRect().right})),
              fieldLabels:[...document.querySelectorAll('input,select,textarea')].map(e=>({id:e.id,type:e.type,name:e.name,labels:[...e.labels].map(l=>l.textContent.trim()),required:e.required,autocomplete:e.autocomplete})),
              resourceStats:performance.getEntriesByType('resource').reduce((a,r)=>{a.count++; a.transfer+=r.transferSize||0;return a;},{count:0,transfer:0})
            };
          });
          result.screenshot=path.join(dir,`${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${width}.png`);
          await page.screenshot({path:result.screenshot,fullPage:true});
        } catch(e) {result.error=e.message;report.failures.push({width,route,error:e.message});}
        result.pageErrors=errors;result.badResponses=badResponses;result.failedRequests=failedRequests;
        report.matrix.push(result);
        fs.writeFileSync(path.join(dir,'browser-results.json'),JSON.stringify(report,null,2));
        console.log(JSON.stringify({route,width,status:result.status,overflow:result.dom?result.dom.documentWidth-width:null,errors:errors.length,brokenImages:result.dom?.images.filter(i=>!i.complete||i.naturalWidth===0).length}));
        await page.close();
      }
      await context.close();
    }
    const context = await browser.newContext({viewport:{width:1440,height:900}});
    const page=await context.newPage();
    await page.goto(root+'/',{waitUntil:'networkidle'});
    report.interactions.mutationPreflight=await page.evaluate(()=>{document.title='Assessment B mutation preflight';const s=document.createElement('script');s.textContent='window.__assessmentBInjection=true';document.head.appendChild(s);return {title:document.title,scriptExecuted:window.__assessmentBInjection===true};});
    await page.keyboard.press('Tab');
    report.interactions.firstFocus=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent.trim(),class:document.activeElement.className,outline:getComputedStyle(document.activeElement).outline}));
    await page.keyboard.press('Enter');
    report.interactions.skipLink=await page.evaluate(()=>({tag:document.activeElement.tagName,id:document.activeElement.id}));
    await page.evaluate(()=>scrollTo(0,1100));await page.waitForTimeout(250);
    const trigger=page.getByRole('button',{name:'Open menu'});
    await trigger.focus();await page.keyboard.press('Enter');await page.waitForTimeout(100);
    report.interactions.menuOpened=await page.evaluate(()=>({dialog:!!document.querySelector('[role=dialog]'),focus:document.activeElement.getAttribute('aria-label'),mainInert:document.querySelector('main').inert,bodyFixed:document.body.style.position,phase:document.querySelector('[role=dialog]')?.dataset.phase}));
    const focusSteps=[];
    for(let i=0;i<10;i++){await page.keyboard.press('Tab');focusSteps.push(await page.evaluate(()=>({text:(document.activeElement.getAttribute('aria-label')||document.activeElement.textContent).trim(),insideDialog:!!document.activeElement.closest('[role=dialog]')})));}
    report.interactions.menuTabCycle=focusSteps;
    await page.keyboard.press('Escape');
    report.interactions.menuEscape=await page.evaluate(()=>({dialog:!!document.querySelector('[role=dialog]'),focus:document.activeElement.getAttribute('aria-label'),scrollY,mainInert:document.querySelector('main').inert}));
    await page.goto(root+'/contact',{waitUntil:'networkidle'});
    await page.getByRole('button',{name:'Open email draft'}).click();
    await page.waitForTimeout(80);
    report.interactions.contactEmpty=await page.evaluate(()=>({focused:document.activeElement.id,invalid:[...document.querySelectorAll('[aria-invalid=true]')].map(e=>({id:e.id,describedBy:e.getAttribute('aria-describedby')})),errors:[...document.querySelectorAll('[id$="-error"]')].map(e=>e.textContent)}));
    await page.getByLabel('Your name').fill('Browser review');await page.getByLabel('Email address').fill('invalid-email');await page.getByLabel('Your message').fill('Review draft only. No message will be sent.');
    await page.getByRole('button',{name:'Open email draft'}).click();await page.waitForTimeout(80);
    report.interactions.contactInvalidEmail=await page.evaluate(()=>({focused:document.activeElement.id,error:document.querySelector('#contact-email-error')?.textContent}));
    await page.getByLabel('Email address').fill('browser-review@example.com');await page.getByLabel('What’s this about?').selectOption('A project');
    await page.reload({waitUntil:'networkidle'});
    report.interactions.contactDraftReload=await page.evaluate(()=>Object.fromEntries([...document.querySelector('form').elements].filter(e=>e.name).map(e=>[e.name,e.value])));
    await page.getByRole('button',{name:'Open email draft'}).click();await page.waitForTimeout(150);
    report.interactions.contactValid=await page.evaluate(()=>({status:document.querySelector('[role=status]')?.textContent,fallback:[...document.querySelectorAll('form a')].map(e=>({text:e.textContent,href:e.getAttribute('href')}))}));
    await page.getByLabel('Your message').fill('Revised draft');
    report.interactions.contactEdited=await page.evaluate(()=>({status:document.querySelector('[role=status]')?.textContent,fallbackCount:document.querySelectorAll('form a').length,stored:JSON.parse(sessionStorage.getItem('portfolio-contact-draft'))}));
    await page.screenshot({path:path.join(dir,'contact-draft-1440.png'),fullPage:true});
    await context.close();
    const nojs=await browser.newContext({viewport:{width:390,height:900},javaScriptEnabled:false});
    const nojsPage=await nojs.newPage();
    report.interactions.noJS=[];
    for(const route of routes){await nojsPage.goto(root+route,{waitUntil:'networkidle'});report.interactions.noJS.push(await nojsPage.evaluate(()=>({path:location.pathname,title:document.title,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent),mainVisible:getComputedStyle(document.querySelector('main')).opacity,links:document.querySelectorAll('a[href]').length,form:document.querySelector('form')?{action:document.querySelector('form').action,noValidate:document.querySelector('form').noValidate}:null})));}
    await nojs.close();
  } finally {report.finished=new Date().toISOString();fs.writeFileSync(path.join(dir,'browser-results.json'),JSON.stringify(report,null,2));await browser.close();}
})();

