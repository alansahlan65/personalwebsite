import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir='public/demos/munchpal-opener/assets';
// Rasterize the source PNG/JPEG fills before SVG WebP optimization. librsvg
// cannot resolve every embedded WebP fill, although Chrome can.
await sharp(`${dir}/list.svg`,{density:144}).webp({lossless:true,effort:6}).toFile(`${dir}/list.webp`);
for(const name of ['list.svg','food-row.svg','request-button.svg','report-original.svg','chat-original.svg']){
  let svg=await fs.readFile(`${dir}/${name}`,'utf8');
  const images=[...new Set(svg.match(/data:image\/(?:png|jpeg);base64,[A-Za-z0-9+/=]+/g)||[])];
  for(const image of images){
    const bytes=Buffer.from(image.split(',')[1],'base64');
    const webp=await sharp(bytes).webp({lossless:true,effort:6}).toBuffer();
    if(webp.length<bytes.length)svg=svg.replaceAll(image,'data:image/webp;base64,'+webp.toString('base64'));
  }
  await fs.writeFile(`${dir}/${name}`,svg);
  console.log(`${name}: ${(Buffer.byteLength(svg)/1024).toFixed(0)} KiB`);
}
const manifest=JSON.parse(await fs.readFile(`${dir}/manifest.json`,'utf8'));
manifest.listPreview='assets/list.webp is a 2x lossless raster of the refreshed vector list, used only as the brief context plane. The isolated selected row and action remain vector.';
manifest.optimization='Animation SVGs convert embedded source rasters to lossless WebP only when smaller and retain original definitions. All dimensions and photographic pixels remain intact; sources/ is untouched.';
await fs.writeFile(`${dir}/manifest.json`,JSON.stringify(manifest,null,2)+'\n');
