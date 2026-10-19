# MunchPal product tour

Reviewed 19 October 2026. Open [index.html](index.html) to play the editable offline composition, keeping `assets/` beside it. CSS and the 20-second GSAP timeline are inline. [The delivered MP4](munchpal-opener.mp4) is silent, 1920×1080 at 60fps; [poster.webp](poster.webp) supplies its opening frame.

Space pauses/plays, R replays, and H shows review controls. `?debug=1` enables scrubbing; `?clean=1` starts paused. `window.OPENER.seek(seconds)` seeks deterministically. Reduced motion starts paused.

[The asset manifest](assets/manifest.json) records authentic English Figma exports, source IDs, hashes, and preparation. Original typography/wording remain; photographs retain source raster resolution. Request, later acceptance/chat, and the separate bulk-donation report are distinct prototype moments, without an instant-acceptance or live-pickup claim.

The portfolio plays the MP4, so HTML edits require a render. From the root run `node scripts/render-munchpal-opener.mjs <absolute-ffmpeg-path>` using the repository's rendering tools. See [production notes](../../../docs/munchpal-opener.md) and [motion direction](../../../docs/munchpal-opener-creative-brief.md).

GSAP's license notice remains in `assets/gsap.min.js`; the font license is [assets/font-license.txt](assets/font-license.txt). Source exports preserved by the manifest may extend beyond the final composition's direct references.
