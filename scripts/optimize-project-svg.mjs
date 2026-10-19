// Keep the original SVGs. Display copies retain vectors and bitmap dimensions.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const selected = process.argv.slice(2);
const roots = selected.length ? selected : ['paylecta', 'munchpal', 'aurelia'];
const bitmapPattern = /data:image\/(?:png|jpeg|jpg);base64,[A-Za-z0-9+/=\r\n]+/g;
const cache = new Map();

async function optimizeBitmap(uri) {
  if (!cache.has(uri)) cache.set(uri, (async () => {
    const source = Buffer.from(uri.slice(uri.indexOf(',') + 1), 'base64');
    const result = await sharp(source).webp({ quality: 90, effort: 4, smartSubsample: true }).toBuffer();
    // Preserve the encoded original if high-quality WebP is larger.
    return result.length < source.length ? `data:image/webp;base64,${result.toString('base64')}` : uri;
  })());
  return cache.get(uri);
}

(async () => {
  const records = selected.length
    ? JSON.parse(await fs.readFile('docs/project-preview-assets.json', 'utf8')).filter(record => !roots.includes(record.slug))
    : [];
  for (const slug of roots) {
    const directory = path.resolve('public/images/figma', slug);
    for (const name of await fs.readdir(directory)) {
      if (!name.endsWith('.svg') || name.endsWith('.preview.svg')) continue;
      const source = await fs.readFile(path.join(directory, name), 'utf8');
      let preview = source;
      for (const uri of new Set(source.match(bitmapPattern) || [])) preview = preview.replaceAll(uri, await optimizeBitmap(uri));
      const output = name.replace(/\.svg$/, '.preview.svg');
      if (Buffer.byteLength(preview) >= Buffer.byteLength(source) * .99) {
        await fs.rm(path.join(directory, output), { force: true });
        continue;
      }
      await fs.writeFile(path.join(directory, output), preview);
      const record = { slug, source: name, preview: output, bitmapEncoding: 'WebP quality 90, original dimensions', sourceBytes: Buffer.byteLength(source), previewBytes: Buffer.byteLength(preview) };
      records.push(record);
      console.log(JSON.stringify(record));
    }
  }
  await fs.writeFile(path.resolve('docs/project-preview-assets.json'), JSON.stringify(records, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
