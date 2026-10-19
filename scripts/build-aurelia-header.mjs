// Bang Motion opener architecture: fixed stage, shared camera, pure timeline rendering.
import fs from 'node:fs/promises';
import path from 'node:path';

const input = path.resolve('.scratch/aurelia-design-tour/header-source');
const output = path.resolve('public/demos/aurelia');
const read = file => fs.readFile(path.join(input, file), 'utf8');
const hero = await read('hero.html');
const nav = await read('navigation.html');
const cards = await Promise.all(['neighbor-before', 'tirta-card', 'neighbor-after'].map(n => read(n + '.html')));
const gallery = await read('property.html');
const back = (await read('stay.html')).match(/<button class="booking-back"[^>]*>[\s\S]*?<\/button>/)[0];
const planner = (await read('dates-empty.html')).replace(/(<footer class="booking-actions"[^>]*><div>)<span><\/span>/, '$1' + back);
const sourceCSS = (await read('source-desktop.css')).replace(/@font-face\s*\{[^}]*\}/g, '');
const css = await fs.readFile('.scratch/aurelia-design-tour/header.css', 'utf8');
const js = await fs.readFile('.scratch/aurelia-design-tour/header.js', 'utf8');
const days = Array.from({ length: 35 }, (_, i) => {
  const day = i === 0 ? 28 : i > 31 ? i - 31 : i;
  return `<button type="button" data-day="${i > 0 && i < 32 ? day : ''}" ${i === 0 || i > 31 ? 'disabled' : ''} aria-label="${day} March 2027">${day}</button>`;
}).join('');
// The starter's stage/camera architecture is retained; its default skin is replaced.
await fs.copyFile('C:/Users/DESKTOP-IOT0021/.codex/skills/bang-motion/assets/starter-opener.html', path.join(output, 'index.html'));
const html = `<!doctype html>
<html lang="en" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Aurelia · From a place to a plan</title>
<meta name="description" content="A 36-second silent Aurelia film: a Bali house becomes a personal stay plan.">
<!-- Made with Bang Motion by Bang Tutorial. Object relay, nine beats, one photographic thread. -->
<style>${sourceCSS}\n${css}</style><script src="assets/gsap.min.js"></script></head><body>
<svg id="filters" aria-hidden="true"><defs><filter id="word-blur" x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="0 0"/></filter></defs></svg>
<div id="stage" aria-label="Aurelia motion composition">
<div id="surround"><div id="daylight"></div></div>
<div id="world">
<div id="hero-plane">${hero}${nav}</div>
<div id="collection-plane"><div id="collection-heading">${await read('collection-header.html')}</div><div id="collection-cards">${cards.map((c, i) => `<div class="film-card" data-card="${i}">${c}</div>`).join('')}</div></div>
<div id="gallery-plane">${gallery}</div>
<div id="forest-panel"><div class="forest-light"></div></div>
<div id="planner-plane">${planner}</div>
<div id="browser-calendar" role="group" aria-label="Browser date picker"><header><strong>March 2027</strong><span>⌃ &nbsp; ⌄</span></header><div class="weekdays"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div><div class="calendar-days">${days}</div></div>
</div>
<div id="shared-photo"></div>
<p id="photo-caption">Tirta Forest Villa</p>
<div id="film-type"><p id="planning-phrase"><span>Make it</span><span><em>your stay</em></span></p><p id="revision-phrase"><span>Stay a little <em>longer</em></span></p></div>
<div id="cursor" aria-hidden="true"><svg viewBox="0 0 32 36"><path d="M4 3v27l7-7 6 11 5-3-6-10h10Z"/></svg><i></i></div>
<div id="loading-poster"><img src="poster.webp" alt="Aurelia, Come for Bali. Stay for the house."></div>
</div>
<div id="ui"><button id="btn-play">Play</button><button id="btn-restart">Restart</button><input id="scrub" aria-label="Timeline" type="range" min="0" max="3600" value="0"><output id="clock">0.00s</output></div>
<script>${js}</script></body></html>`;
await fs.writeFile(path.join(output, 'index.html'), html);
console.log(`Built 36-second Aurelia header, ${(html.length / 1024).toFixed(0)} KiB, with original source DOM and local assets.`);
