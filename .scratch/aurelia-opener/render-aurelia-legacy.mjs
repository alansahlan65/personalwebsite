// Bang-motion: exact frame seeks, browser snapshots, lossless PNG pipe to H.264.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {chromium} from '@playwright/test';
import sharp from 'sharp';
const dir=path.resolve('public/demos/aurelia');
const reviewDir=path.resolve('.scratch/aurelia-opener/review');
const url=pathToFileURL(path.join(dir,'index.html')).href+'?clean=1';
const fps=60,duration=26,total=fps*duration;
const encoderPath=process.argv.find(a=>a.toLowerCase().endsWith('ffmpeg.exe'));
const reviewOnly=process.argv.includes('--review');
const diagnose=process.argv.includes('--diagnose');
const joinOnly=process.argv.includes('--join');
const launch=async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url);await page.waitForFunction(()=>window.OPENER?.ready,{timeout:120000});
 return {browser,page,errors};
};
const seek=async(page,t)=>page.evaluate(async time=>{await window.OPENER.seekFrame(time);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},t);
async function review(){
 await fs.mkdir(reviewDir,{recursive:true});const {browser,page,errors}=await launch();
 try{
  const times=[0,2,3.65,4.5,5.9,7.3,8.6,9.45,10.55,11.3,12.8,13.6,16.4,18.3,20.7,21.8,23.2,24.85,25.99];
  const tiles=[],records=[];
  for(const [i,t]of times.entries()){
   await seek(page,t);const bytes=await page.screenshot({type:'png'});
   await fs.writeFile(path.join(reviewDir,String(t).replace('.','-')+'.png'),bytes);
   const label=Buffer.from(`<svg width="480" height="28"><rect width="480" height="28" fill="#142019"/><text x="12" y="20" fill="#ffffff" font-size="16" font-family="sans-serif">${t.toFixed(2)}s</text></svg>`);
   const tile=await sharp(bytes).resize(480,270).extend({bottom:28,top:0,left:0,right:0,background:'#142019'}).composite([{input:label,left:0,top:270}]).png().toBuffer();
   tiles.push({input:tile,left:i%4*480,top:Math.floor(i/4)*298});
   records.push(await page.evaluate(t=>({t,checkIn:document.querySelector('#planner input[name=checkIn]').value,checkOut:document.querySelector('#planner input[name=checkOut]').value,area:document.querySelector('#planner select[name=area]').value,property:document.querySelector('#planner select[name=property]').value,claim:[...document.querySelectorAll('#claims p')].filter(e=>Number(getComputedStyle(e).opacity)>.9).map(e=>e.textContent),resultVisible:Number(getComputedStyle(document.querySelector('.booking-success')).opacity)>.9}),t));
  }
  await sharp({create:{width:1920,height:Math.ceil(tiles.length/4)*298,channels:3,background:'#142019'}}).composite(tiles).png().toFile(path.join(reviewDir,'contact-sheet.png'));
  await seek(page,2);await sharp(await page.screenshot()).webp({quality:92,effort:6}).toFile(path.join(dir,'poster.webp'));
  await seek(page,13.6);const a=await page.screenshot();const stateA=await page.evaluate(()=>[...document.querySelectorAll('#world,#planner,.booking-step,#claims p')].map(e=>({class:e.className,id:e.id,transform:getComputedStyle(e).transform,opacity:getComputedStyle(e).opacity,filter:getComputedStyle(e).filter})));
  await seek(page,5.9);await seek(page,13.6);const b=await page.screenshot();const stateB=await page.evaluate(()=>[...document.querySelectorAll('#world,#planner,.booking-step,#claims p')].map(e=>({class:e.className,id:e.id,transform:getComputedStyle(e).transform,opacity:getComputedStyle(e).opacity,filter:getComputedStyle(e).filter})));
  await fs.writeFile(path.join(reviewDir,'seek-a.png'),a);await fs.writeFile(path.join(reviewDir,'seek-b.png'),b);await fs.writeFile(path.join(reviewDir,'seek-state.json'),JSON.stringify({stateA,stateB},null,2));
  const deterministic=a.equals(b);if(!deterministic)errors.push('Repeated scrub at 13.6 seconds produced different pixels.');
  await fs.writeFile(path.join(reviewDir,'review.json'),JSON.stringify({duration,fps,width:1920,height:1080,deterministic,errors,records},null,2));
  console.log(JSON.stringify({review:reviewDir,deterministic,errors,frames:times.length}));if(errors.length)throw Error(errors.join('\n'));
 }finally{await browser.close();}
}
async function segment(index,start,end){
 const {browser,page,errors}=await launch();const output=path.join(reviewDir,`segment-${index}.mp4`);
 const encoder=spawn(encoderPath,['-y','-hide_banner','-loglevel','warning','-f','image2pipe','-framerate',String(fps),'-vcodec','png','-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-frames:v',String(end-start),output],{stdio:['pipe','ignore','pipe'],windowsHide:true});
 let logs='';encoder.stderr.on('data',d=>logs+=d);const completed=once(encoder,'close');encoder.stdin.on('error',()=>{});
 try{
  for(let frame=start;frame<end;frame++){
   await seek(page,frame/fps);const bytes=await page.screenshot({type:'png'});
   if(!encoder.stdin.write(bytes))await once(encoder.stdin,'drain');
   if((frame-start)%120===0)console.log(`Worker ${index+1}: ${frame-start}/${end-start} frames (${(frame/fps).toFixed(1)}s)`);
  }
  encoder.stdin.end();const [code]=await completed;if(code!==0)throw Error(logs);if(errors.length)throw Error(errors.join('\n'));
  return output;
 }finally{await browser.close();if(encoder.exitCode===null)encoder.kill();}
}
async function main(){
 if(diagnose){
  const {browser,page}=await launch();
  const snapshot=()=>page.evaluate(()=>[...document.querySelectorAll('#stage *')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return{tag:e.tagName,class:e.className?.baseVal??e.className,id:e.id,x:r.x,y:r.y,width:r.width,height:r.height,transform:s.transform,translate:s.translate,scale:s.scale,opacity:s.opacity,color:s.color,background:s.backgroundColor,font:s.font,lineHeight:s.lineHeight,filter:s.filter,boxShadow:s.boxShadow,visibility:s.visibility,text:e.childElementCount?null:e.textContent,style:e.getAttribute('style')}}));
  await seek(page,25.99);await seek(page,13.6);const a=await snapshot();await fs.writeFile(path.join(reviewDir,'diag-a.png'),await page.screenshot());
  await seek(page,5.9);await seek(page,13.6);const b=await snapshot();await fs.writeFile(path.join(reviewDir,'diag-b.png'),await page.screenshot());
  const diff=[];a.forEach((value,i)=>{if(JSON.stringify(value)!==JSON.stringify(b[i]))diff.push({index:i,a:value,b:b[i]});});
  await fs.writeFile(path.join(reviewDir,'dom-diff.json'),JSON.stringify(diff,null,2));console.log(JSON.stringify(diff.slice(0,12),null,2));await browser.close();return;
 }
 if(reviewOnly)return review();if(!encoderPath)throw Error('Pass a local ffmpeg.exe path, or --review.');
 await fs.mkdir(reviewDir,{recursive:true});
 const segments=joinOnly?[0,1,2].map(i=>path.join(reviewDir,`segment-${i}.mp4`)):await Promise.all([segment(0,0,520),segment(1,520,1040),segment(2,1040,total)]);
 // MP4's movie header rounds segment duration to milliseconds. An explicit
 // concat duration keeps each 520-frame segment on the exact 60fps clock.
 const list=path.join(reviewDir,'segments.txt');await fs.writeFile(list,segments.map(p=>"file '"+p.replaceAll('\\','/')+"'\nduration "+(520/fps).toFixed(10)).join('\n'));
 const final=path.join(dir,'aurelia-opener.mp4');
 const encoder=spawn(encoderPath,['-y','-hide_banner','-loglevel','warning','-f','concat','-safe','0','-i',list,'-c','copy','-movflags','+faststart','-metadata','title=Aurelia - Plan your Bali stay',final],{stdio:['ignore','ignore','pipe'],windowsHide:true});
 let logs='';encoder.stderr.on('data',d=>logs+=d);const [code]=await once(encoder,'close');if(code!==0)throw Error(logs);
 const metadata={durationSeconds:duration,frameRate:fps,frames:total,width:1920,height:1080,codec:'H.264',pixelFormat:'yuv420p',audio:'silent',sizeBytes:(await fs.stat(final)).size,posterTimeSeconds:2,render:'Deterministic GSAP seeks at i/60. Two animation frames settle. PNG frames piped to FFmpeg, three non-overlapping segments joined losslessly.',errors:[]};
 await fs.writeFile(path.join(dir,'render.json'),JSON.stringify(metadata,null,2)+'\n');console.log(JSON.stringify(metadata));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
