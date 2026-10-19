// Deterministic Bang Motion export. Every frame is explicitly sought and encoded.
// Usage: node scripts/render-munchpal-opener.mjs <absolute ffmpeg.exe path>
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {chromium} from '@playwright/test';
import sharp from 'sharp';
async function main(){
 const ffmpeg=process.argv[2];if(!ffmpeg)throw new Error('Pass a local ffmpeg executable path.');
 const dir=path.resolve('public/demos/munchpal');
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.join(dir,'index.html')).href+'?clean=1');
 await page.waitForFunction(()=>window.OPENER?.ready,{timeout:120000});
 const duration=await page.evaluate(()=>window.OPENER.DURATION),fps=60,total=duration*fps;
 if(duration!==20)throw new Error('Unexpected composition duration');
 const encoder=spawn(ffmpeg,['-y','-hide_banner','-loglevel','warning','-f','image2pipe','-framerate',String(fps),'-vcodec','png','-i','pipe:0','-an','-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-frames:v',String(total),'-metadata','title=MunchPal - Food sharing, made clear',path.join(dir,'munchpal-opener.mp4')],{stdio:['pipe','ignore','pipe'],windowsHide:true});
 let logs='';encoder.stderr.on('data',d=>logs+=d.toString());const completed=once(encoder,'close');
 encoder.stdin.on('error',e=>console.error(e.message));
 try{
  for(let i=0;i<total;i++){
   await page.evaluate(async t=>{await window.OPENER.seekFrame(t);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},i/fps);
   const bytes=await page.screenshot({type:'png'});
   if(i===0)await sharp(bytes).webp({quality:92,effort:6}).toFile(path.join(dir,'poster.webp'));
   if(!encoder.stdin.write(bytes))await once(encoder.stdin,'drain');
   if(i%60===0)console.log(`${i}/${total} frames · ${(i/fps).toFixed(0)}s`);
  }
  encoder.stdin.end();const [code]=await completed;if(code!==0)throw new Error(logs);
  if(errors.length)throw new Error(errors.join('\n'));
  const stat=await fs.stat(path.join(dir,'munchpal-opener.mp4'));
  const record={durationSeconds:duration,frameRate:fps,frames:total,width:1920,height:1080,codec:'H.264',pixelFormat:'yuv420p',audio:'silent',sizeBytes:stat.size,render:'Each frame sought at i / 60, two animation frames settled, PNG losslessly piped to FFmpeg.',errors};
  await fs.writeFile(path.join(dir,'render.json'),JSON.stringify(record,null,2)+'\n');console.log(JSON.stringify(record,null,2));
 }finally{await browser.close();if(!encoder.killed&&encoder.exitCode===null)encoder.kill();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
