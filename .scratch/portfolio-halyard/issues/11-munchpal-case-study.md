# 11: Munchpal case study and gallery entry

Status: needs-info

**What to build:** Visitors can preview Munchpal and read a complete food-sharing case study with supported project status, contribution, and outcome claims.

**Blocked by:** 07: Role parallax and first-journey integration; 08: Aurelia horizontal media and full case study.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Read current Munchpal source material and verify role/contribution, collaborators, status, actual media, and available links.
- [x] Specifically recheck task-time and completion figures against evidence. Omit unsupported values or testing claims rather than presenting them as measured outcomes.
- [x] Add row 04, Munchpal, Food sharing, and its direct case-study destination with the established inline gallery, shared entry, focus, and return-position behavior.
- [ ] Lead with user problem, audience, actual contribution, and consequential decisions; follow with interaction evidence and implementation considerations. Apply better-writing and match case-study depth to evidence.
- [x] Deliver three or four explanatory horizontal media panels with progress/skip, vertical longer reading, and equivalent stacked mobile/reduced-motion content.
- [x] Identify any selective new demonstration as a later exploration, clearly separate from original contributions, production history, and reported testing.
- [x] Extend the clickable inventory and shared pointer behavior. Verify single active preview, keyboard precedence, stable click areas, retargeting during rapid cross-row movement, and one-tap touch entry.
- [x] Browser-test preview/open/back, direct/new-tab entry, media/skip/focus, resize and preference changes, and responsive overflow against available sibling projects.
- [x] Check authentic media readiness, loading, available destinations, and metadata consistency; run applicable type checks, lint, and build.

## Comments

- 2026-09-28: Implemented in `b0715ab` from the original 13-page PDF and its embedded public Figma prototype. Alan confirmed client-project status. The PDF does not independently establish his exact contribution, other collaborators, or formal Garda Pangan involvement; the case study avoids those claims. Original source media and reported test figures are assessed in `docs/munchpal-case-study.md`.
- 2026-09-28: Final integrated Playwright suite passed 156/156; the independent committed production build, lint, type check, and 14/14 focused Munchpal checks passed. Gallery, source panels, navigation, touch, reduced motion, no-JavaScript reading, social image, and responsive layout are documented in `.scratch/portfolio-halyard/ticket-11-verification.md`. Two attribution-dependent checklist items remain open until Alan confirms personal responsibilities and collaborators.
