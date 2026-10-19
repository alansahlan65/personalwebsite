import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
import {execFileSync} from 'node:child_process';

const folder = '.scratch/website-review/distill';
const recordPath = `${folder}/provenance-pixels.json`;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
if (process.argv[2] === 'before') {
  const scan = await fs.readFile(`${folder}/provenance.log`, 'utf8');
  const paths = scan.split(/\r?\n/).filter(line => line.startsWith('MISSING: ')).map(line => line.slice(9));
  await fs.mkdir(`${folder}/origin-backups`, {recursive:true});
  const records = [];
  for (const path of paths) {
    const name = path.replaceAll('/', '-');
    const bytes = await fs.readFile(path);
    const origin = JSON.parse(await fs.readFile(`${path}.json`, 'utf8'));
    const prompt = `Source origin. ${JSON.stringify(origin)}`;
    const backup = `${folder}/origin-backups/${name}`;
    const promptPath = `${folder}/origin-backups/${name}.txt`;
    await fs.writeFile(backup, bytes);
    await fs.writeFile(promptPath, prompt);
    records.push({path, backup, promptPath, origin, prompt, originalFileSha256:hash(bytes), decodedPixelsSha256:hash(await sharp(bytes).raw().toBuffer())});
  }
  await fs.writeFile(recordPath, JSON.stringify(records, null, 2));
  console.log(`Saved complete origins and pixel hashes for ${records.length} existing share cards.`);
} else if (process.argv[2] === 'embed') {
  const engine = 'C:/Users/DESKTOP-IOT0021/.agents/skills/impeccable/scripts/bin/windows-x64/impeccable.exe';
  const records = JSON.parse(await fs.readFile(recordPath, 'utf8'));
  for (const record of records) {
    execFileSync(engine, ['embed-prompt', record.path, '--prompt', record.prompt]);
    const embedded = execFileSync(engine, ['embed-prompt', record.path, '--read'], {encoding:'utf8'}).trim();
    if (embedded !== record.prompt) throw new Error(`Incomplete origin for ${record.path}`);
  }
  console.log(`Verified complete embedded origin text for ${records.length} share cards.`);
} else {
  const records = JSON.parse(await fs.readFile(recordPath, 'utf8'));
  for (const record of records) {
    const bytes = await fs.readFile(record.path);
    if (hash(await sharp(bytes).raw().toBuffer()) !== record.decodedPixelsSha256) {
      await fs.copyFile(record.backup, record.path);
      throw new Error(`Restored ${record.path}: pixels changed.`);
    }
    record.currentFileSha256 = hash(bytes);
    record.pixelsUnchanged = true;
    await fs.writeFile(`${record.path}.json`, JSON.stringify({
      ...record.origin, prompt:record.prompt,
      origin_metadata:{recorded_on:'2026-10-03', original_file_sha256:record.originalFileSha256, current_file_sha256:record.currentFileSha256, decoded_pixel_sha256:record.decodedPixelsSha256, pixels_unchanged:true}
    }, null, 2) + '\n');
  }
  await fs.writeFile(recordPath, JSON.stringify(records, null, 2));
  console.log(`Verified unchanged decoded pixels for all ${records.length} share cards.`);
}
