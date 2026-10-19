import fs from 'node:fs/promises';

const project='public/demos/munchpal-opener';
const illustration=(await fs.readFile(`${project}/assets/people-illustration.svg`,'utf8'))
  .replace('<svg ','<svg id="people-art" role="img" aria-label="Two illustrated people browsing MunchPal" data-layout-ignore ')
  .replace('xlink:href="list.webp"','xlink:href="assets/list.webp"');
const filename=`${project}/index.html`;
const html=await fs.readFile(filename,'utf8');
const region=/<!-- BEGIN MUNCHPAL PEOPLE -->[\s\S]*?<!-- END MUNCHPAL PEOPLE -->/;
if(!region.test(html))throw new Error('The inline illustration region is missing.');
await fs.writeFile(filename,html.replace(region,`<!-- BEGIN MUNCHPAL PEOPLE -->\n${illustration}\n<!-- END MUNCHPAL PEOPLE -->`));
