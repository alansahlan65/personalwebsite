import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

const nodes = {
  'hero': '274:8716', 'hero-dark': '274:7967', 'collection': '274:8756',
  'holiday-rhythm': '274:9183', 'residence': '274:9229', 'areas': '274:9279',
  'standards': '274:9329', 'request-dates': '368:1857',
  'request-preferences': '368:1902', 'request-contact': '368:1960', 'request-review': '368:2014',
};
const records = [];
for (const [name, nodeId] of Object.entries(nodes)) {
  const image = `/images/figma/aurelia/${name}.svg`;
  const bytes = await fs.readFile(`public${image}`);
  const source = bytes.toString('utf8');
  const root = source.match(/<svg[^>]*>/)[0];
  const width = Number(root.match(/width="([\d.]+)"/)[1]);
  const height = Number(root.match(/height="([\d.]+)"/)[1]);
  const markup = source.replace(/"[^"]*"|'[^']*'/g, '""');
  // Figma's glass/blur effects can use static foreignObject fallback layers.
  if (/<script\b|\bon\w+=/i.test(markup)) throw new Error(`Unexpected active SVG content in ${name}`);
  const paths = (source.match(/<path\b/g) || []).length;
  if (!paths) throw new Error(`No vector interface geometry in ${name}`);
  const record = {
    image, nodeId, width, height,
    origin: 'Complete original Figma SVG section or form export downloaded on 13 October 2026. Interface shapes and outlined type retain source vector geometry; photographic fills retain their source raster resolution. No screenshot wrapper, raster crop or generated interface.',
    source: `https://www.figma.com/design/nzrjEnmrDqfXUPLawnxmEn/Dump?node-id=${nodeId.replace(':', '-')}`,
    bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'),
  };
  records.push(record);
  await fs.writeFile(`public${image}.json`, JSON.stringify(record, null, 2) + '\n');
}
const file = 'docs/figma-project-assets.json';
const existing = JSON.parse(await fs.readFile(file, 'utf8')).filter(record => !record.image.startsWith('/images/figma/aurelia/'));
await fs.writeFile(file, JSON.stringify([...existing, ...records], null, 2) + '\n');
const previews = JSON.parse(await fs.readFile('docs/project-preview-assets.json', 'utf8')).filter(record => record.slug === 'aurelia');
const sourceBytes = records.reduce((sum, record) => sum + record.bytes, 0);
const displayBytes = records.reduce((sum, record) => sum + (previews.find(preview => record.image.endsWith('/' + preview.source))?.previewBytes ?? record.bytes), 0);
console.log(JSON.stringify({ originals: records.length, sourceBytes, displayBytes, savings: 1 - displayBytes / sourceBytes }));
