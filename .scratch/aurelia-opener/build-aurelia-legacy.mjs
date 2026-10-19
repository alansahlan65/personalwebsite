// Original Aurelia DOM + brand assets, composed with the bang-motion stage/rig.
import fs from 'node:fs/promises';
import path from 'node:path';
const dir=path.resolve('public/demos/aurelia');
const capture=path.resolve('.scratch/aurelia-opener/capture');
await fs.mkdir(dir,{recursive:true});
const skill='C:/Users/DESKTOP-IOT0021/.codex/skills/bang-motion';
await fs.copyFile(path.join(skill,'assets/starter-opener.html'),path.join(dir,'index.html'));
const read=name=>fs.readFile(path.join(capture,name),'utf8');
const payload={hero:await read('hero.html'),navigation:await read('navigation.html')};
for(const state of ['dates-empty','dates-filled','stay','dates-revised','contact-empty','contact','result'])payload[state]=await read(state+'.html');
const productCSS=await fs.readFile('D:/Project/New Real Estate Landing Page Premium/app/globals.css','utf8');
const styles=await fs.readFile(path.resolve('.scratch/aurelia-opener/composition.css'),'utf8');
const timeline=await fs.readFile(path.resolve('.scratch/aurelia-opener/timeline.js'),'utf8');
const html=`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aurelia · Plan your Bali stay</title>
<meta name="description" content="A 26-second motion study of Aurelia's editable Bali stay planner.">
<style>${productCSS}\n${styles}</style>
<script src="assets/gsap.min.js"></script></head><body>
<svg id="filters" aria-hidden="true"><defs></defs></svg>
<div id="stage"><div id="world"><div id="surround"><div id="daylight"></div></div>
<div id="website"></div><div id="selected-photo"><img src="assets/tirta-forest-villa-1.webp" alt=""></div>
<div id="photo-shade"></div><div id="planner-plane"><div id="planner"></div>
<div id="cursor"><svg viewBox="0 0 32 36"><path d="M4 3v27l7-7 6 11 5-3-6-10h10Z"/></svg><i></i></div>
<div id="choices"></div></div></div>
<div id="claims"><p id="claim-dates">Start with your dates</p><p id="claim-stay">Choose your holiday rhythm</p><p id="claim-edit">Your dates stay editable</p><p id="claim-review">Review your stay plan</p></div>
</div>
<div id="ui"><button id="btn-play">Play</button><button id="btn-restart">Restart</button><input id="scrub" aria-label="Timeline" type="range" min="0" max="2600" value="0"><span id="clock">0.00s</span></div>
<script id="source-data" type="application/json">${JSON.stringify(payload).replaceAll('<','\\u003c')}</script>
<script>${timeline}</script></body></html>`;
await fs.writeFile(path.join(dir,'index.html'),html);
await fs.copyFile('.scratch/aurelia-opener/style-brief.md',path.join(dir,'DESIGN.md'));
await fs.copyFile('.scratch/aurelia-opener/source-audit.md',path.join(dir,'SOURCE.md'));
await fs.copyFile('.scratch/aurelia-opener/assets.json',path.join(dir,'assets/manifest.json'));
console.log(`Built ${html.length} characters of self-contained source and original DOM.`);
