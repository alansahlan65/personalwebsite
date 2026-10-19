
import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const directory=path.resolve(".scratch/website-review/clarify/visual");
await fs.mkdir(directory,{recursive:true});
const browser=await chromium.launch();
const evidence=[];
const failures=[];
try {
  for(const width of [1440,1000,768,650,390,320]){
    const context=await browser.newContext({viewport:{width,height:width>700?1080:844},hasTouch:width<650,isMobile:width<650});
    const page=await context.newPage();
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    const save=async name=>{
      if([1440,768,390,320].includes(width))await page.screenshot({path:path.join(directory,name+"-"+width+".png"),caret:"initial"});
    };
    const measure=async(surface,scale)=>{
      const result=await page.evaluate(()=>{
        const styles=element=>{
          const s=getComputedStyle(element);
          const r=element.getBoundingClientRect();
          return {text:element.textContent.trim(),x:r.x,width:r.width,fontSize:s.fontSize,lineHeight:s.lineHeight,color:s.color};
        };
        return {
          viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
          text:Array.from(document.querySelectorAll(".project-context, .project-type, .work-preview-note, [id=contact-delivery-hint], .hero-copy p")).map(styles),
          rows:Array.from(document.querySelectorAll(".project-row")).map(element=>{
            const title=element.querySelector("h3").getBoundingClientRect();
            const index=element.querySelector(".project-number").getBoundingClientRect();
            return {slug:element.dataset.project,titleTop:title.y,indexTop:index.y};
          }),
        };
      });
      if(result.scrollWidth>result.viewport)failures.push({surface,width,scale,problem:"Horizontal overflow",...result});
      for(const item of result.text){
        if(item.x < -1 || item.x+item.width>result.viewport+1)failures.push({surface,width,scale,problem:"Text outside viewport",item});
      }
      evidence.push({surface,width,scale,...result});
    };
    try {
      await page.goto("http://127.0.0.1:3000/");
      await page.evaluate(()=>document.fonts.ready);
      await expect(page.getByRole("button",{name:/^Product Designer\./})).toBeVisible();
      await page.waitForTimeout(650);
      await measure("home",1);
      await save("home");
      for(const [current,next] of [["Product Designer","Design Engineer"],["Design Engineer","Interaction Designer"]]){
        await page.getByRole("button",{name:new RegExp("^"+current+"\\.")}).focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("button",{name:new RegExp("^"+next+"\\.")})).toBeVisible();
        await measure(next,1);
        await save(next==="Design Engineer"?"engineer":"interaction");
      }
      await page.getByRole("button",{name:/^Interaction Designer\./}).focus();
      await page.keyboard.press("Enter");
      await page.locator("#work").evaluate(element=>element.scrollIntoView());
      await page.waitForTimeout(600);
      await expect.poll(()=>page.locator(".project-banner-compact").evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
      await measure("work-compact",1);
      await save("work");
      await page.locator(".project-link").first().focus();
      await expect(page.locator(".project-row").first()).toHaveAttribute("data-expanded","true");
      await expect.poll(()=>page.locator(".project-banner-expanded").first().evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
      await measure("work-expanded",1);
      await save("work-expanded");
      await page.locator(".project-link").first().blur();
      await page.mouse.move(0,0);
      await page.evaluate(()=>document.documentElement.style.fontSize="200%");
      await page.locator("#work").evaluate(element=>element.scrollIntoView());
      await page.waitForTimeout(400);
      await measure("work-compact",2);
      await save("work-text-200");
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.getByRole("button",{name:/^Product Designer\./}).focus();
      await page.keyboard.press("Enter");
      await measure("home-engineer",2);
      await save("home-text-200");
      await page.goto("http://127.0.0.1:3000/contact");
      await page.evaluate(()=>document.fonts.ready);
      const form=page.getByRole("form",{name:"Prepare an email"});
      await expect(form).toBeVisible();
      await expect(form).toHaveAccessibleDescription("This form opens your email app with a draft. You send the email from there.");
      await page.waitForTimeout(650);
      await form.scrollIntoViewIfNeeded();
      await measure("contact",1);
      await save("contact");
      await page.evaluate(()=>document.documentElement.style.fontSize="200%");
      await measure("contact",2);
      await save("contact-text-200");
      expect(errors).toEqual([]);
    } catch(error) {
      failures.push({width,problem:error.message});
    } finally { await context.close(); }
  }
} finally {await browser.close();}
await fs.writeFile(path.join(directory,"evidence.json"),JSON.stringify({evidence,failures},null,2)+"\n");
console.log(JSON.stringify({samples:evidence.length,failures},null,2));
if(failures.length)process.exitCode=1;
