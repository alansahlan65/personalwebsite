# Paylecta opener

Reviewed 19 October 2026. The later 26-second Portfolio motion study presents a merchant check-in using original desktop/mobile designs. [Motion direction](paylecta-opener-creative-brief.md) owns the sequence; [the package](../public/demos/paylecta/README.md) explains playback.

## Delivery and editing

[Editable HTML](../public/demos/paylecta/index.html) contains a deterministic GSAP composition with local fonts/artwork/runtime. The delivered MP4 is 1920×1080 at 60fps, silent H.264/yuv420p with fast-start metadata; [render.json](../public/demos/paylecta/render.json) owns exact encoding/size. The poster samples the dashboard at 2.3 seconds.

Run `node scripts/render-paylecta-opener.mjs <absolute-ffmpeg-path>` from the root after editing. The renderer uses the repository's Playwright/Sharp tools and seeks each of 1560 frames. Watching the package has no installation/network dependency.

## Evidence and adaptations

[The asset manifest](../public/demos/paylecta/assets/manifest.json) records native Figma exports, originals, transparent derivatives, and local corrections. SVG vectors/type remain original; the invoice document retains its 3069×4096 raster resolution.

Demo overlays select Invoices in the editor sidebar, align its unit price with the preview's $157.54, retain the $164.63 total, and reconcile the existing $97 payout breakdown to $98 subtotal, $1 fee, and $0 tax. Search/heading/time labels receive the documented local copy corrections. Source originals remain preserved.

Creation, overdue invoice, and payout detail are separate sample states. Success remains Success when opening the existing record. The film establishes no executable payments, sent invoice, delivered reminder, or newly completed payout. It is separate from Alan's original June 2025 design contribution.

## Website behavior

The shared video opener pauses offscreen/in hidden tabs, preserves manual pause intent, supports replay and runtime motion preference changes, and exposes native controls without JavaScript. Source facts and the continuous case narrative follow the opener. [Quality checks](quality.md) records current verification.
