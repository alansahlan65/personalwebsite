# 01: Responsive portrait homepage

Status: ready-for-agent

**What to build:** Visitors can open a running portfolio and recognize Alan through the approved responsive portrait composition, exact identity copy, and ordered homepage structure.

**Blocked by:** None (can start immediately).

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Inspect the available composition reference, photo, AS identity, and Halyard delivery before using them. Record provenance and any missing inputs; clearly label development substitutes and do not treat them as release assets.
- [ ] Use React, TypeScript, Next.js, static content, and client interaction components. The page runs locally and builds successfully; no backend, authentication, or CMS is introduced.
- [ ] Render the homepage sections in order: portrait hero, Design / Build / Refine, selected work, compact About, contact/footer. Sections awaiting later tickets remain honest development scaffolding with no invented links, project screenshots, or claims.
- [ ] Render a separate large Alan Sahlan. name, inset rectangular portrait, sparse blue corner detail, exact Design • Engineer supporting phrase, and ID square beside Based in Indonesia. Omit hero CTA, widget, invented location details, and long loading introduction.
- [ ] Use Halyard Display Variable throughout interface text with neutral sans-serif loading fallback, inherited control fonts, fluid sizes, approved palette, and responsive gutters. Preserve the AS graphic and authentic screenshot typography.
- [ ] Show full brand and primary navigation at the top, including a readable mobile arrangement. Only expose actionable destinations when they work; ticket 02 completes the non-project destinations and ticket 03 adds navigation transitions.
- [ ] Keep native scrolling and meaningful semantic structure. Check keyboard focus, useful image alternatives, contrast, reduced-motion-safe initial rendering, reserved media dimensions, and immediate access to available links.
- [ ] Verify the composition at 390px, 768px, 1440px, and 320px overflow check plus intermediate widths. Essential identity text remains visible, and decorative sections do not enlarge document width.
- [ ] Establish Playwright at the running-browser boundary with a meaningful homepage load/identity and responsive overflow check. Run applicable type checks, lint, and build; record actual outcomes.
