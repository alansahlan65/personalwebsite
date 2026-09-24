# 03: Full-to-compact header and Sliding Stairs Menu

Status: ready-for-agent

**What to build:** Visitors can navigate through the full header at the top and an accessible compact stairs menu after scrolling, even when they interrupt the animation.

**Blocked by:** 02: About, resume, and contact journey.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Implement I-05 with full brand/navigation at the top on desktop and narrow screens. Start compact mode above 96px and restore full mode below 48px with centrally tunable thresholds and no header-height jump.
- [ ] Remove hidden controls from the tab order and avoid duplicate interactive navigation. Defer mode switching while focus remains in the header; freeze mode changes while the menu is open. Handle refreshed/restored scroll positions and direct page loads.
- [ ] Implement I-06 using five initial staggered vertical stairs panels, the approved palette and font, large Work/About/Contact/Resume links, and smaller verified professional links.
- [ ] Implement restrained repeating label/image strips on menu-row hover with static readable labels on exit. Repetitions are decorative, create no extra links, and stop when inactive or closed.
- [ ] Represent closed, opening, open, and closing explicitly. Honor latest intent without queued transitions; keep close available during opening and let links activate before animation completion.
- [ ] Use a labelled dialog/navigation pattern, visible focus, focus containment, background inertness, Escape dismissal, saved-position scroll locking/restoration, and trigger focus restoration on dismissal or meaningful destination focus after navigation.
- [ ] Preserve modified-click/new-tab behavior. Reduced motion, including an in-session change, retains the complete menu with immediate/static equivalents.
- [ ] Browser-test threshold oscillation, header focus during scroll, Escape during opening, rapid toggles, early link activation, resize while open, history navigation, and menu close. No invisible overlay, lost focus, duplicate controls, or persistent scroll lock remains.
- [ ] Record a short header/menu demonstration and run applicable type checks, lint, and build. Leave controls compatible with ticket 05's stationary-target magnetic behavior.
