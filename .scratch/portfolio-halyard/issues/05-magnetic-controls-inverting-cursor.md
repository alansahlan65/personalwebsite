# 05: Magnetic controls and image-inverting cursor

Status: ready-for-agent

**What to build:** Visitors receive consistent magnetic feedback and an image-inverting cursor across the existing navigation and project journey without losing reliable click targets.

**Blocked by:** 03: Full-to-compact header and Sliding Stairs Menu; 04: Aurelia preview-to-case-study journey.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Implement I-03 as reusable behavior and maintain an inventory covering brand/home, desktop links, menu trigger/close, menu links, project row, About, contact, profiles, resume, and case-study actions.
- [ ] Measure pointer displacement against a stationary semantic target and move only a visible child. Use restrained springs, about 3–6px text displacement and up to 10–16px for large controls as tunable starting values.
- [ ] Use separate nested wrappers for magnetic motion and gallery/route movement. Give project title/arrow groups subtle movement while preserving row geometry; prevent double magnetism on nested elements.
- [ ] Every action activates immediately at actual pointer coordinates during movement. Touch, keyboard, reduced motion, and forced colors use stable equivalent focus/press feedback.
- [ ] Implement I-04 with a small smoothed following dot, an actual negative-color disc over imagery through verified compositing, and an arrow only over actionable image targets. Keep portrait and decorative imagery free of misleading arrows.
- [ ] Keep the cursor decorative, hidden from assistive technology, and input-transparent. Hide native cursor only after replacement readiness, restore native meaning for text selection, and reset/hide on window exit, touch, reduced motion, enhancement failure, and route/menu changes.
- [ ] Use the same real pointer input for cursor and magnetism without feeding their visual movement into each other. While the menu is open it owns pointer feedback. Clean up frames/listeners, invalidate bounds on layout changes, and pause unnecessary hidden-page work.
- [ ] Browser-test click reliability, focus/hover precedence, rapid target changes, input/preference changes, and navigation. Manually compare inversion on light/dark image areas and verify selection and window exit/reentry.
- [ ] Record the combined gallery/cursor/magnetism behavior, verify all current inventory actions, and run applicable type checks, lint, and build.
