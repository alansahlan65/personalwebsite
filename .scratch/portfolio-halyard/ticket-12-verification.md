# Ticket 12 release-candidate verification

Checked on 28 September 2026 against the integrated working tree. This is a reviewable preview, not approval to deploy. The public domain is undecided; the site retains `noindex`, and Next.js currently resolves absolute share URLs against `localhost:3000`.

## Candidate

Home includes the hero, Design / Build / Refine roles, ordered four-project gallery, concise About, and contact footer. `/about` and all four case-study routes load directly. The original AS mark is used for the header, footer, and favicon. Alan's portrait and current resume are present. The Halyard requirement in the original spec was superseded by Alan's Plus Jakarta Sans choice, bundled locally. The development placeholder in the footer was removed.

An invalid path returns a custom HTTP 404 with a keyboard-accessible route to selected work. The root share card uses Alan's supplied portrait and original mark; Aurelia's card uses an inspected live-concept screenshot. All four cases have source-based previews. Open Graph and Twitter tags, image dimensions, and alt text were checked in generated HTML. The root metadata accepts a `SITE_ORIGIN` build setting; the portfolio domain must be set before public sharing so absolute metadata URLs do not use localhost.

Alan confirmed Paylecta as his independent client design, PawFriend as his design direction with ChatGPT-assisted coding and no other design/build collaborators, and Munchpal as his client research, Garda Pangan interviews, information architecture, user flows, wireframes, UI design, and usability testing with no other design collaborators. Research and testing involved other people. The pages distinguish those contributions from AI-assisted implementation and participants. Garda Pangan interviews do not establish a formal partnership. Unsupported metrics, bookings, adoptions, donations, and production outcomes remain unasserted. Alan confirmed permission to display the underlying Aurelia imagery and supplied role icons, describing them as AI-generated; the exact Streamline license tier was not independently verified, so the footer credit remains.

After studying Evan Yudistira's [Flex Design System](https://www.evanyudis.com/p/flex-design-system) and [Tokopedia Purchase Flow](https://www.evanyudis.com/p/tokopedia-purchase-flow) case studies, I rewrote all four portfolio narratives around a short problem-led opening, personal contribution, specific design decisions, annotated original artifacts, implementation implications, and only supported observations. The copy is newly written for Alan's work; no reference phrasing or metrics were reused. [Final 390 px](demos/12-aurelia-390.png) and [1440 px](demos/12-aurelia-1440.png) captures were visually checked for each case.

## Browser and action coverage

The integrated Chromium suite covers 320, 390, 650, 768, 999/1000, and 1440 px; enlarged text; touch emulation; keyboard focus; forced colors; reduced motion at load and after a preference change; direct routes; gallery entry/return; modified clicks; Back/Forward; anchors; menu interruption; role scroll reversal; media progress/skip; and no-JavaScript reading. The new release checks cover HTTP 404 recovery, direct route titles and social images, every application link/button's magnetic marker, and local resume/mail destinations. Playwright's development overlay is outside the application action inventory. No email was sent.

The first integrated run passed 157/159. Two pre-existing motion fixtures awaited a transient `covering` state after the awaited Playwright click or Back navigation had already completed. Starting those actions concurrently with observation made the sampling deterministic; the three focused motion checks then passed. The final integrated run passed 159/159.

The [current-site header/menu](demos/12-header-menu.webm), [gallery/cursor](demos/12-gallery-cursor.webm), [role parallax](demos/12-role-parallax.webm), and [Munchpal reading journey](demos/12-munchpal-journey.webm) recordings show the candidate running in Chromium. The [390 px recovery screenshot](demos/12-not-found-mobile.png) was visually inspected. Earlier ticket recordings cover individual project flows. Alan's visual and interaction review remains required before marking the build accepted.

## Performance and destinations

The [final production measurement](demos/12-performance.json) used Chromium 153.0.8010.12, a cold browser context per route, 1440 × 900 viewport, 4× CPU throttle, 150 ms latency, 1.6 Mbps download, and 0.72 Mbps upload. Home FCP/LCP were 1.176/1.948 s, transfer 815 KiB, CLS 0.0012. The four case-study LCP observations ranged from 1.220 to 2.124 s, transfer 319–435 KiB, and CLS 0.0001. All five routes returned 200, had no broken loaded images, no page or console errors, and no horizontal overflow at 1440 px. Native case videos use `preload="none"`; the home page has no project videos. These are single-run lab observations, not field scores or physical-device results.

The [destination check](demos/12-links.json) returned HTTP 200 for GitHub, Behance, Aurelia, PawFriend, and both source PDFs. CADIT's HEAD request failed in Node, but its official page loaded in the web browser on 28 September 2026. LinkedIn returned 405 to HEAD and blocked browser inspection; its exact profile URL was previously confirmed by Alan. The resume returned a PDF from the local site, and mail actions were checked as hrefs without launching a client.

## Remaining acceptance work

- Alan must review the visual composition, image crops, cursor inversion, menu/gallery/parallax motion, and one complete case-study journey in the running preview and recordings.
- Alan has not chosen a public portfolio URL. Set `SITE_ORIGIN` to that origin during the production build and recheck absolute Open Graph/Twitter URLs before deployment; keep `noindex` until publication is intended.
- Coverage is Chromium desktop and emulated mobile/touch only. Physical phones, Safari, Firefox, and assistive-technology use were not exercised. Automated results cannot substitute for Alan's visual acceptance.

## Final checks

TypeScript, ESLint, and the final production build passed after the reference-led copy rewrite. The build statically prerendered the six content routes, custom not-found page, and five social images. The complete Chromium suite passed 159/159 against that production build. The four case-study openings were visually checked at 390 and 1440 px after the final edit.
