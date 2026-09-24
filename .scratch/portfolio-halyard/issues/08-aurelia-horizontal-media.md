# 08: Aurelia horizontal media and full case study

Status: ready-for-agent

**What to build:** Visitors can understand Aurelia through a complete decision-led case study, browse its desktop horizontal media, skip it, and read equivalent stacked content on smaller screens.

**Blocked by:** 04: Aurelia preview-to-case-study journey.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Complete Aurelia's verified problem, contribution, and consequential decisions before presenting interaction/implementation evidence. Keep self-initiated concept attribution and apply better-writing.
- [ ] Implement I-08 after the concise introduction: ordinary vertical scroll advances three or four desktop panels horizontally. Each panel explains a workflow, interaction, or decision with brief text and authentic media.
- [ ] Provide visible progress and a working skip link to subsequent content. Keyboard focus never disappears into an unreachable offscreen panel.
- [ ] Use normal vertical flow for longer research/implementation explanations. Stack equivalent media content on narrow screens and reduced motion, including runtime preference changes.
- [ ] Recalculate travel/pinning after resize or media changes and clean up on route exit. Use GSAP/ScrollTrigger only if it materially simplifies the work; preserve single ownership of transforms and native scrolling.
- [ ] Show supported starting states, actions, feedback, resulting states, and reversal/interruption behavior where evidence exists. Any selectively built demonstration is explicitly a later exploration separate from original contributions and historical results.
- [ ] Use evidence-supported depth without filler, invented screenshots, fabricated metrics, or dependency on paid tutorial source. Required authentic content missing from sources remains a recorded release dependency.
- [ ] Browser-test scrolling, progress, skip destination/focus, keyboard reachability, resize/media changes, stacked content, reduced motion, and navigation cleanup.
- [ ] Keep shared controls compatible with the existing or forthcoming pointer system, optimize media delivery, and run applicable type checks, lint, and build. This case study establishes the reusable reading pattern for later tickets.
