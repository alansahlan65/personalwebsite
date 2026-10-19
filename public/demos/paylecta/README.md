# Paylecta opener

Reviewed 19 October 2026. The delivered 26-second silent 16:9 study follows original desktop/mobile finance designs. Open [index.html](index.html) directly; assets, fonts, and libraries are local. Space pauses, R replays, and reduced motion starts paused.

`?debug=1` shows the review timeline; `?clean=1` starts paused. `window.OPENER.seekFrame(t)` deterministically seeks the visual state. The delivered [MP4](paylecta-opener.mp4), [poster](poster.webp), [render metadata](render.json), and [asset manifest](assets/manifest.json) accompany the editable HTML.

Original exports remain preserved. Transparent derivatives remove export-added canvas fills; local copy/sample-data corrections are recorded in the manifest and [production notes](../../../docs/paylecta-opener.md). Invoice creation, overdue detail, and payout are separate examples. The film establishes no sent invoice, delivered reminder, or newly completed payout. Presentation surfaces use 24px corners while source UI keeps its original geometry.

Render from the root with `node scripts/render-paylecta-opener.mjs <absolute-ffmpeg-path>`. Repository Playwright/Sharp tools seek all 1560 frames before 60fps encoding. Watching the package needs no such installation. [Motion direction](../../../docs/paylecta-opener-creative-brief.md) records the current sequence; the [source Figma](https://www.figma.com/design/nzrjEnmrDqfXUPLawnxmEn/Dump?node-id=307-3) records original designs. Keep bundled library/font license notices and manifest-preserved exports.
