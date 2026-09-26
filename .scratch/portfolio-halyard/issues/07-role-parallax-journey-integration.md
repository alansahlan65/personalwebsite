# 07: Role parallax and first-journey integration

Status: ready-for-agent

**What to build:** Visitors scroll through responsive role tracks and can continue through the proven navigation and project journey without conflicting motion or input behavior.

**Blocked by:** 06: Shared-image project entry.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Implement I-01 immediately after the hero with only the Design / Build / Refine label and Product Designer, Design Engineer, and Interaction Designer tracks in Halyard.
- [x] Use rights-cleared landscape photographs in horizontal capsules as decorative media. Repeat phrases/capsules enough to cover travel, alternate adjacent directions, and use staggered starting offsets.
- [x] Map travel to section scroll progress. Slow, fast, reversed, and stopped scrolling produce predictable positions without autonomous marquee motion, snapping, gaps, or delayed catch-up.
- [x] Recalculate after font readiness and resize; clip decorative overflow within the section without enlarging document width. Expose one semantic copy per role and hide decorative duplicates.
- [x] Support ordinary touch scrolling. Reduced motion at load and when changed displays readable stationary labels and images.
- [x] Verify the combined header/menu, magnetic gallery, cursor, project entry/return, and parallax path before duplicating the gallery pattern. Preserve menu pointer precedence and keyboard ownership of gallery focus.
- [x] Browser-test scroll reversal/stop, resizing, touch, keyboard, reduced motion, and responsive overflow at required widths. Check that parallax introduces no navigation or page-position regressions.
- [x] Record text parallax and the integrated journey, document any missing real assets, and run applicable type checks, lint, and build.

## Implementation

Implemented 2026-09-26. I-01 now follows the hero with the exact label and roles, alternating direct scroll travel, staggered offsets, measured repetitions, local clipping, and three creator-published CC0 photographs. One semantic paragraph per role remains; duplicates and media are decorative. Font readiness and resize refresh measurements. Touch scrolling remains native. Reduced motion is stationary from first paint and responds to preference changes.

The first checkbox remains open solely for Halyard web-font delivery. The existing font stack names Halyard, but no authorized delivered files or Adobe Fonts stylesheet have been supplied. The approved comparison image, remaining project media, and current release resume are also still missing. See [assets](../../../docs/assets.md).

The combined journey verifies menu pointer precedence, keyboard ownership of the gallery, shared Aurelia image entry, and return to the saved page position. No gallery pattern was duplicated. The recording covers scroll travel, stop/reversal, menu, keyboard project entry/return, mobile resize, and reduced motion: [demo](../demos/07-roles-integrated-journey.webm). Behavior and measured conditions are in [role parallax](../../../docs/role-parallax.md).

Verification: typecheck, lint, and production build pass. The full Chromium browser suite passed 78/78 against the production preview, including 12 new role/integration tests. Required widths 320/390/650/768/1000/1440 px, loaded decorative images, semantic duplication, font metric changes, native touch gestures, enlarged text, and dynamic motion preferences are covered. Local frame timing and stopped-position measurements are recorded without claiming a cross-device performance score.

## Review correction

The Spec review found that at 320 px every moving copy of Product Designer and Interaction Designer could remain partly clipped. A new full-label browser assertion reproduced the issue. Travel is now bounded by measured label width, with staggered starts that retain one complete visible label throughout travel. Enlarged labels that cannot fit use a stationary wrapping row. The measurement label is hidden from assistive technology. The integrated journey also asserts that no browser errors occur during project entry/return.

After this correction, the 40 affected homepage, pointer, shared-entry, and role tests passed in development; all 12 role/integration tests passed again against the corrected production build. Typecheck, lint, and build passed. The recording, screenshots, and measurements were refreshed, including a 320 px screenshot. The earlier full-suite run was 78/78.
