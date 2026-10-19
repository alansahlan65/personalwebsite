(async () => {
  const { chromium } = await import('playwright');
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const out = path.resolve('.scratch/alan-motion-debug');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const video = await fs.readFile('C:/Users/DESKTOP-IOT0021/Videos/Screen Recordings/Screen Recording 2026-10-01 142315.mp4');
  await page.route('http://recording.local/video.mp4', r => r.fulfill({ body: video, contentType: 'video/mp4', headers: { 'Access-Control-Allow-Origin': '*' } }));
  await page.setContent('<video crossorigin="anonymous" src="http://recording.local/video.mp4" preload="auto" muted></video>');
  await page.waitForFunction(() => document.querySelector('video').readyState >= 2);
  const meta = await page.evaluate(() => { const v = document.querySelector('video'); return { duration: v.duration, width: v.videoWidth, height: v.videoHeight }; });
  console.log(meta);
  await fs.writeFile(path.join(out, 'recording-metadata.json'), JSON.stringify(meta, null, 2));
  const frames = await page.evaluate(async () => {
    const v = document.querySelector('video');
    const c = document.createElement('canvas');
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext('2d'), frames = []; let next = 0;
    const done = new Promise(resolve => { v.onended = resolve; });
    function capture(_, metadata) {
      if (metadata.mediaTime >= next) {
        ctx.drawImage(v, 0, 0);
        frames.push({ t: metadata.mediaTime, png: c.toDataURL('image/png').split(',')[1] });
        next += 1 / 12;
      }
      if (!v.ended) v.requestVideoFrameCallback(capture);
    }
    v.requestVideoFrameCallback(capture); await v.play(); await done; return frames;
  });
  for (const {t, png} of frames) await fs.writeFile(path.join(out, `playback-${t.toFixed(3)}.png`), Buffer.from(png, 'base64'));
  console.log({ frames: frames.length, unique: new Set(frames.map(f => f.png)).size });
  await browser.close();
})();
