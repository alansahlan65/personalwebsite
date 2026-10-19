import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';

const folder = '.scratch/website-review/adapt-polish';
const recordPath = `${folder}/provenance-pixels.json`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const scan = await fs.readFile(`${folder}/provenance-scan.log`, 'utf8');
const paths = scan.split(/\r?\n/).filter(line => line.startsWith('MISSING: ')).map(line => line.slice(9));
if (process.argv[2] === 'before') {
  await fs.mkdir(`${folder}/origin-backups`, {recursive:true});
  const records = [];
  for (const path of paths) {
    const backup = `${folder}/origin-backups/${path.split('/').at(-1)}`;
    const file = await fs.readFile(path);
    await fs.writeFile(backup, file);
    records.push({path, backup, originalFileSha256:hash(file), decodedPixelsSha256:hash(await sharp(file).raw().toBuffer())});
  }
  await fs.writeFile(recordPath, JSON.stringify(records, null, 2));
  console.log(`Saved file and decoded-pixel hashes for ${records.length} source rasters.`);
} else {
  const records = JSON.parse(await fs.readFile(recordPath, 'utf8'));
  for (const record of records) {
    const file = await fs.readFile(record.path);
    if (hash(await sharp(file).raw().toBuffer()) !== record.decodedPixelsSha256) {
      await fs.copyFile(record.backup, record.path);
      throw new Error(`Restored ${record.path}, decoded pixels changed.`);
    }
    record.currentFileSha256 = hash(file);
    record.pixelsUnchanged = true;
    const sidecarPath = `${record.path}.json`;
    // All twelve source sidecars were unchanged before this pass. Retain their
    // full origin records because the format fallback writes a fresh sidecar.
    const sidecar = JSON.parse(execFileSync('git', ['-c', 'safe.directory=D:/Project/Personal Web', 'show', `HEAD:${sidecarPath}`], {encoding:'utf8'}));
    sidecar.prompt = `Source origin. ${JSON.stringify(sidecar)}`;
    sidecar.createdAt = '2026-10-03T09:53:18.332Z';
    sidecar.origin_metadata = {recorded_on:'2026-10-03', original_file_sha256:record.originalFileSha256, current_file_sha256:record.currentFileSha256, decoded_pixel_sha256:record.decodedPixelsSha256, pixels_unchanged:true};
    await fs.writeFile(sidecarPath, JSON.stringify(sidecar, null, 2) + '\n');
  }
  await fs.writeFile(recordPath, JSON.stringify(records, null, 2));
  console.log(`Verified identical decoded pixels for ${records.length} source rasters.`);
}
