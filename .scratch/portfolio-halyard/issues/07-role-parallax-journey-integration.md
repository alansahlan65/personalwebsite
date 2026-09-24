# 07: Role parallax and first-journey integration

Status: ready-for-agent

**What to build:** Visitors scroll through responsive role tracks and can continue through the proven navigation and project journey without conflicting motion or input behavior.

**Blocked by:** 06: Shared-image project entry.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Implement I-01 immediately after the hero with only the Design / Build / Refine label and Product Designer, Design Engineer, and Interaction Designer tracks in Halyard.
- [ ] Use rights-cleared landscape photographs in horizontal capsules as decorative media. Repeat phrases/capsules enough to cover travel, alternate adjacent directions, and use staggered starting offsets.
- [ ] Map travel to section scroll progress. Slow, fast, reversed, and stopped scrolling produce predictable positions without autonomous marquee motion, snapping, gaps, or delayed catch-up.
- [ ] Recalculate after font readiness and resize; clip decorative overflow within the section without enlarging document width. Expose one semantic copy per role and hide decorative duplicates.
- [ ] Support ordinary touch scrolling. Reduced motion at load and when changed displays readable stationary labels and images.
- [ ] Verify the combined header/menu, magnetic gallery, cursor, project entry/return, and parallax path before duplicating the gallery pattern. Preserve menu pointer precedence and keyboard ownership of gallery focus.
- [ ] Browser-test scroll reversal/stop, resizing, touch, keyboard, reduced motion, and responsive overflow at required widths. Check that parallax introduces no navigation or page-position regressions.
- [ ] Record text parallax and the integrated journey, document any missing real assets, and run applicable type checks, lint, and build.
