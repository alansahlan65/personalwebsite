# Alan homepage character

Reviewed 19 October 2026. Home uses a generated voxel illustration based on Alan's supplied photo; About retains the real portrait. [The component](../app/components/alan-character.tsx) and [CSS](../app/components/alan-character.module.css) own its layered display.

## Artwork and provenance

The default, original wave, and greeting PNGs are 1122×1402 transparent renders. Eight directional views and eight corresponding greeting expressions keep registered canvases; only their head/neck masks are displayed. Adjacent `.png.json` sidecars preserve exact Image Gen prompts, input roles, and original outputs. The default body, clothes, and original directional artwork remain preserved.

The unrelated reference sprite supplied the directional-view approach; Alan's photo/default render supplied identity. The greeting reference supplied expression and gesture. These are generated illustrations, not photographs or a live 3D mesh.

## Current behavior

Fine-pointer movement selects rendered head views in 45-degree sectors, with a neutral radius and hysteresis against jitter. Tracking waits for required neutral images; an early valid pointer position is retained while loading. Face/expression changes blend over 150ms. Separate body/arm blends use the numeric 240ms pose duration and a 12-degree shoulder arc. The bubble says Hi! Nice to meet you! and transitions over 150ms.

Isolated additive blend groups normalize current weights before an interrupted animation is replaced, keeping each group's weights at one. Face direction/expression share one blend; body/arm transitions do not restart for a head turn. The lowered sleeve stays fixed and the shoulder overlap covers the masked seam.

Keyboard focus/activation greets immediately; Escape dismisses without moving focus. Touch taps greet and outside taps dismiss. Reduced motion, forced colors, and unsupported additive blending use immediate pose changes. Touch/preferences omit directional head-image loading. Tracking pauses offscreen and in hidden tabs, and window exit returns the head forward. Frame-batched pointer/geometry work updates React state only when direction changes.

Phone layout and bubble placement follow the compact Home composition in [DESIGN.md](../DESIGN.md). [Quality checks](quality.md) owns the current rendering/behavior evidence.

## Saved renders

| Render | Image | Provenance |
| --- | --- | --- |
| character-default | [PNG](../public/images/alan-character-default.png) | [JSON](../public/images/alan-character-default.png.json) |
| character-greeting | [PNG](../public/images/alan-character-greeting.png) | [JSON](../public/images/alan-character-greeting.png.json) |
| character-wave | [PNG](../public/images/alan-character-wave.png) | [JSON](../public/images/alan-character-wave.png.json) |
| head-bottom-greeting | [PNG](../public/images/alan-head-bottom-greeting.png) | [JSON](../public/images/alan-head-bottom-greeting.png.json) |
| head-bottom-left-greeting | [PNG](../public/images/alan-head-bottom-left-greeting.png) | [JSON](../public/images/alan-head-bottom-left-greeting.png.json) |
| head-bottom-left | [PNG](../public/images/alan-head-bottom-left.png) | [JSON](../public/images/alan-head-bottom-left.png.json) |
| head-bottom-right-greeting | [PNG](../public/images/alan-head-bottom-right-greeting.png) | [JSON](../public/images/alan-head-bottom-right-greeting.png.json) |
| head-bottom-right | [PNG](../public/images/alan-head-bottom-right.png) | [JSON](../public/images/alan-head-bottom-right.png.json) |
| head-bottom | [PNG](../public/images/alan-head-bottom.png) | [JSON](../public/images/alan-head-bottom.png.json) |
| head-left-greeting | [PNG](../public/images/alan-head-left-greeting.png) | [JSON](../public/images/alan-head-left-greeting.png.json) |
| head-left | [PNG](../public/images/alan-head-left.png) | [JSON](../public/images/alan-head-left.png.json) |
| head-right-greeting | [PNG](../public/images/alan-head-right-greeting.png) | [JSON](../public/images/alan-head-right-greeting.png.json) |
| head-right | [PNG](../public/images/alan-head-right.png) | [JSON](../public/images/alan-head-right.png.json) |
| head-top-greeting | [PNG](../public/images/alan-head-top-greeting.png) | [JSON](../public/images/alan-head-top-greeting.png.json) |
| head-top-left-greeting | [PNG](../public/images/alan-head-top-left-greeting.png) | [JSON](../public/images/alan-head-top-left-greeting.png.json) |
| head-top-left | [PNG](../public/images/alan-head-top-left.png) | [JSON](../public/images/alan-head-top-left.png.json) |
| head-top-right-greeting | [PNG](../public/images/alan-head-top-right-greeting.png) | [JSON](../public/images/alan-head-top-right-greeting.png.json) |
| head-top-right | [PNG](../public/images/alan-head-top-right.png) | [JSON](../public/images/alan-head-top-right.png.json) |
| head-top | [PNG](../public/images/alan-head-top.png) | [JSON](../public/images/alan-head-top.png.json) |
