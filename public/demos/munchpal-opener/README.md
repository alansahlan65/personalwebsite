# MunchPal: The next step is clear

Silent 40-second HyperFrames composition at 1920×1080, prepared for 60fps delivery. Based on [the creative brief](../../../docs/munchpal-opener-creative-brief.md), with the user's subsequent logo-first opening and animated illustrated people. This is a later portfolio motion study of the prototype.

The full logo and headline occupy the first frame. At about 2.5 seconds, two illustrated people begin browsing the app. At 7 seconds the central screen becomes the selected food row and the product tour continues. The last frame returns to the full logo and headline for looping.

## Review

From this directory run `npx hyperframes@0.8.174 preview --background --port 3042`. Review the [Studio project](http://localhost:3042/#project/munchpal-opener). Verify the server with `npx hyperframes@0.8.174 preview --status`. Stop it with `npx hyperframes@0.8.174 preview --stop` when finished.

For offline viewing, open `index.html` with its assets and `viewer.js` beside it. Space pauses or plays, R replays, and H reveals the hidden scrubber. `?debug=1` reveals controls and starts paused. `?clean=1` starts paused without controls. Reduced motion starts on the poster. `window.OPENER.seekFrame(seconds)` settles a deterministic frame for capture.

## Source and editing

`index.html` owns the layout and synchronous paused GSAP timeline, registered as `window.__timelines['munchpal-opener']`. `viewer.js` provides only the standalone browser controls. The runtime controls playback in Studio and headless capture.

`DESIGN.md` records the film's visual identity. `sources/` preserves seven refreshed Figma exports from 19 October 2026. [assets/manifest.json](assets/manifest.json) records node IDs, dimensions, hashes, copy adaptations, source photography, and font licensing. The supplied wordmark remains unchanged. Rubik is bundled under its SIL Open Font License. GSAP retains its license header.

From the repository root, `python scripts/prepare-munchpal-hyperframes.py` isolates source groups and photographs. Then `node scripts/optimize-munchpal-hyperframes.mjs` prepares lossless animation assets and the 2× list context image. These commands require the preserved exports and Rubik font already present here.

`assets/people-illustration.svg` is the original vector artwork for the new opening. After editing it, run `node scripts/sync-munchpal-people.mjs` from the repository root to refresh its inline copy. Separate SVG groups supply the articulated animation. The handset screens use the original list artwork. Generate the list context image before converting embedded source PNGs to WebP so all source photograph fills survive rasterization.

## Verification and delivery

Run `npm run check`, or the individual `npx hyperframes@0.8.174 lint`, `validate`, and `inspect` commands. From the repository root, `node scripts/verify-munchpal-hyperframes.mjs` checks the four taps, source loading, 22 editorial frames, reverse seeking, and the loop. Set `MUNCHPAL_CHROME` to a browser executable when needed.

The source demonstrates distinct request, sent, accepted and conversation states. Two editorial cuts separate elapsed time and the bulk-donation example. The quantity remains 50. The report retains the source date, time, address, food photo and pickup photo. It makes no measured-impact or instant-acceptance claim.

The browser composition is the deliverable for this stage. The existing 20-second MP4 at `../munchpal/` still supplies the portfolio opener. To produce a new MP4 when requested, run `npx hyperframes@0.8.174 render --fps 60 --quality high --output munchpal-opener.mp4` with FFmpeg available. Do not replace the site's video until the new file and poster are delivered together.
