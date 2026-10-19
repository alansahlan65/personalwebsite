import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import crypto from 'node:crypto';
const source='D:/Project/New Real Estate Landing Page Premium';
const target=path.resolve('public/demos/aurelia/assets');
await fs.mkdir(target,{recursive:true});
const records=[];
async function copy(from,to,role){
 const bytes=await fs.readFile(path.join(source,from));await fs.writeFile(path.join(target,to),bytes);
 const record={file:to,source:path.join(source,from),role,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
 if(/webp$/.test(to)){const m=await sharp(bytes).metadata();record.width=m.width;record.height=m.height;}
 records.push(record);
}
await copy('public/images/bali/hero-main.webp','hero.webp','Original light-theme hero');
for(const name of await fs.readdir(path.join(source,'public/images/bali'))){if(name.startsWith('tirta-forest-villa')&&!name.includes('dark'))await copy('public/images/bali/'+name,name,'Original selected stay photograph');}
for(const [family,weights]of[['cormorant-garamond',[400,500]],['manrope',[400,500,600]]]){
 for(const weight of weights){const from=`node_modules/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff2`;await copy(from,`${family}-${weight}.woff2`,'Original product Latin font');}
}
await copy('node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2','cormorant-garamond-italic.woff2','Original italic product headline');
await copy('node_modules/gsap/dist/gsap.min.js','gsap.min.js','Original product GSAP runtime; offline playback');
await fs.writeFile(path.resolve('.scratch/aurelia-opener/assets.json'),JSON.stringify({source,photography:'User-provided concept project; its original imagery is AI-generated.',records},null,2));
console.log(records.map(r=>({file:r.file,width:r.width,height:r.height,bytes:r.bytes})));
