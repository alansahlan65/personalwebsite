# 08: Aurelia horizontal media and full case study

Status: ready-for-agent

**What to build:** Visitors can understand Aurelia through a complete decision-led case study, browse its desktop horizontal media, skip it, and read equivalent stacked content on smaller screens.

**Blocked by:** 04: Aurelia preview-to-case-study journey.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [x] Complete Aurelia's verified problem, contribution, and consequential decisions before presenting interaction/implementation evidence. Keep self-initiated concept attribution and apply better-writing.
- [x] Implement I-08 after the concise introduction: ordinary vertical scroll advances three or four desktop panels horizontally. Each panel explains a workflow, interaction, or decision with brief text and authentic media.
- [x] Provide visible progress and a working skip link to subsequent content. Keyboard focus never disappears into an unreachable offscreen panel.
- [x] Use normal vertical flow for longer research/implementation explanations. Stack equivalent media content on narrow screens and reduced motion, including runtime preference changes.
- [x] Recalculate travel/pinning after resize or media changes and clean up on route exit. Use GSAP/ScrollTrigger only if it materially simplifies the work; preserve single ownership of transforms and native scrolling.
- [x] Show supported starting states, actions, feedback, resulting states, and reversal/interruption behavior where evidence exists. Any selectively built demonstration is explicitly a later exploration separate from original contributions and historical results.
- [x] Use evidence-supported depth without filler, invented screenshots, fabricated metrics, or dependency on paid tutorial source. Required authentic content missing from sources remains a recorded release dependency.
- [x] Browser-test scrolling, progress, skip destination/focus, keyboard reachability, resize/media changes, stacked content, reduced motion, and navigation cleanup.
- [x] Keep shared controls compatible with the existing or forthcoming pointer system, optimize media delivery, and run applicable type checks, lint, and build. This case study establishes the reusable reading pattern for later tickets.

## Comments

### Implementation — 2026-09-26

Aurelia now has three authentic media panels after its problem, contribution, and decisions. Native desktop vertical scroll maps directly to horizontal travel with visible progress. Screenshot links remain keyboard-reachable; skip focuses subsequent implementation notes. Narrow/short/enlarged-text, reduced-motion, and no-JavaScript views show equivalent stacked content. Resize, image/font readiness, runtime preference changes, and route cleanup are covered. Normal-flow notes and a silent live-source recording show supported actions, feedback, and reversal without fabricated research or outcomes.

The recording uses sample dates and never submits a request. Screenshot/video sidecars and [content sources](../../../docs/portfolio-content.md) record evidence and limits. Underlying stay-photography rights require confirmation before release. Original research notes and source-code history were unavailable and are not asserted. Halyard font delivery remains a prior release dependency.

Typecheck, lint, and production build pass. All 15 new media tests and all 19 existing Aurelia/project-entry tests passed in focused runs; immediate Back/Forward also passed three repetitions after fixing a destination-event race. Final review and the single full-suite run follow this implementation commit.

[Integrated demo](../demos/08-aurelia-horizontal-media.webm), responsive screenshots, and local measurements document the result. See [reading behavior](../../../docs/case-media.md).
