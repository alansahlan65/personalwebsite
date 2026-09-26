# 06: Shared-image project entry

Status: ready-for-agent

**What to build:** Visitors see Aurelia's preview connect to its destination hero while navigation, return position, and pointer feedback remain reliable.

**Blocked by:** 05: Magnetic controls and image-inverting cursor.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [x] Implement I-07 as a short shared-image expansion with title settling, preserved image crop, stable dimensions, and a tunable 450–600ms starting duration.
- [x] Keep navigation independent of animation success. Provide a working fallback for absent previews, touch entry, direct URLs, new tabs, and transition failure.
- [x] Preserve modified clicks, Back/Forward, selected-work scroll restoration, and meaningful destination focus. No user action waits for an animation to finish.
- [x] Coordinate gallery, cursor, magnetic wrappers, and route transition so no two animation systems own the same transform and no enlarged cursor remains stuck after navigation.
- [x] Use the menu's coordinated close for menu navigation; do not stack complete stairs and shared-image transitions on the same action.
- [x] Reduced motion removes elaborate spatial entry while preserving content, focus, and navigation, including a preference change during interaction.
- [x] Browser-test the full preview-to-project-and-back journey, immediate clicks during preview growth, direct/new-tab entry, history, and a transition-unavailable/failure fallback. Assert destinations and recovery rather than private animation state.
- [x] Manually review crop continuity and timing, capture the working first-project journey, and run applicable type checks, lint, and build.

## Implementation

Completed 2026-09-26. Aurelia's gallery Link connects its preview to the destination hero through React ViewTransition with a 520ms browser snapshot morph. The title settles over 220ms. The hero follows the introduction so the destination is visible during entry; both slots retain the same 16:10 asset and crop. Native navigation remains independent of animation and clears cursor/magnetic feedback before capture. Menu navigation and return/history behavior retain their existing coordination.

Verification: 7 project-entry browser checks, 19 focused entry/Aurelia checks, and all 66 full-suite Chromium checks passed. Typecheck, lint, and production build passed. Missing/throwing/skipped transitions, absent previews, preference changes, immediate clicks, focus, modified clicks, touch, and history/return are covered. Crop/timing measurements and the recorded journey are in `docs/project-entry.md`.
