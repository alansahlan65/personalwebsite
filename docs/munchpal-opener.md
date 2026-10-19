# MunchPal opener

Reviewed 19 October 2026. A new [40-second HyperFrames composition](../public/demos/munchpal-opener/README.md) implements [the creative brief and subsequent user-directed opening](munchpal-opener-creative-brief.md) for browser review. The existing 20-second MP4 remains the website's delivered opener until a replacement render is requested.

## HyperFrames composition

The film starts on the full original logo and “Food sharing, made clear.” Two animated illustrated people browse the authentic app. The central phone crops to the Padang Rice row at 7 seconds, then the tour demonstrates Request, confirmation and a distinct Request sent state before cutting to later acceptance and conversation. A separate green chapter opens the bulk-donation report. It closes on the complete opening identity composition, with matching first and last frame geometry. The core version is silent, 1920×1080, 40 seconds, prepared for 60fps rendering.

[The project README](../public/demos/munchpal-opener/README.md) owns Studio preview, offline playback, validation, and rendering commands. The composition has one synchronous paused GSAP timeline registered with HyperFrames. Local Rubik, original photographs, and the unchanged supplied identity are bundled. The hidden scrubber, keyboard controls and reduced-motion poster are available offline.

[Its source manifest](../public/demos/munchpal-opener/assets/manifest.json) records seven refreshed Figma SVG exports from 19 October 2026. Original exports are preserved separately from motion assets and brief-authorized English copy adaptations. The missing report photograph is resolved by decoding the actual embedded source image. Lossless WebP optimization preserves raster dimensions and pixels. The sample quantity remains 50, with the source date, time, timezone and address.

The two narrative cuts and short shared-object transitions are intentional. The report viewport clips scrolling fields beneath its fixed heading. Validation annotations identify that clipping and the outgoing bulk card underneath the opening report as intentional layering.

## Existing website film

The delivered sequence remains: identity at 0–2s, nearby food at 2–5s, request at 5–8.5s, acceptance/chat at 8.5–12.5s, separate bulk report at 12.5–16.5s, and identity/homepage return at 16.5–20s.

## Delivery and editing

[The editable composition](../public/demos/munchpal/index.html) has inline CSS/timeline JS with local SVGs, fonts, and GSAP. The delivered silent MP4 is 1920×1080, 60fps, H.264/yuv420p with fast-start metadata. [render.json](../public/demos/munchpal/render.json) owns encoding details; the poster is its first useful frame.

Run `node scripts/render-munchpal-opener.mjs <absolute-ffmpeg-path>` from the root after editing. The renderer uses repository Playwright/Sharp tooling, seeks each of 1200 frames, and pipes images to FFmpeg. This avoids live-recording frame loss. Open the [package README](../public/demos/munchpal/README.md) for offline controls and deterministic seeking.

## Original English sources

[The asset manifest](../public/demos/munchpal/assets/manifest.json) owns source nodes, geometry, and hashes. The resident English flow is `322:5050`; the volunteer flow is `322:2876` (its source section misspells Garda Pangan). Native screen groups supply the list, request confirmation/success, accepted notification, authored Janu conversation, bulk notification, and report. Original glyphs, values, and source wording remain; photograph fills retain their source resolution.

The film's claims describe designed functions: Food sharing, made clear; Find food nearby; Request a meal; Arrange pickup in chat; Bulk donations, documented. It makes no instant-acceptance, live-pickup, food-waste, or task-time claim. The donation report is a separate donor-visible output, not an extension of the resident's single-meal request.

## Website behavior

The shared video opener pauses offscreen and in hidden tabs, preserves manual pause, supports replay, starts paused for reduced motion, and exposes native controls without JavaScript. Case facts and original evidence remain below it. [Quality checks](quality.md) records current validation.
