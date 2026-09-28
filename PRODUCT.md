# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React, TypeScript, and Next.js, as recorded in the approved PRD and implementation spec for this application. Portfolio content is static; browser interactions use client components and Motion for React. GSAP/ScrollTrigger is optional for project media when it materially simplifies implementation. Native scrolling is the baseline; Lenis requires demonstrated benefit without input or navigation regressions.

The responsive homepage foundation is implemented and verified for ticket 01. Ticket 02 adds the About route and confirmed email/profile destinations. On 27 September 2026, Alan supplied his CADIT role, October 2025 start date, component-library responsibility and developer-facing UI work. The updated resume and About page use these facts. The user replaced Halyard with Plus Jakarta Sans, bundled locally. Remaining case studies are unfinished. No deployment provider or production domain has been selected in this session.

## Users

- Hiring managers and design leads evaluating Alan for Product Designer opportunities are the primary audience. They need to assess product judgment, actual contribution, interaction craft, and relevant experience.
- Engineering leads evaluating his developing Design Engineer capabilities need evidence of technical feasibility thinking, implementation choices, and collaboration across design and development.
- Recruiters need accurate background, professional profiles, a current resume, and a reliable contact destination. Prospective collaborators can also use the contact action.

Visitors may scan the homepage, read individual case studies, or arrive directly at a shared project URL. They must be able to use the site with a pointer, keyboard, or touch on desktop and mobile web.

## Product Purpose

Help Alan secure Product Designer opportunities while remaining open to Design Engineer roles as he learns. Make his contribution and reasoning assessable through credible case studies and reliable behavior in the portfolio itself.

Success means visitors can understand his current role and direction, evaluate the work, access his resume, and contact him without animation or navigation obstructing their task. No conversion, hiring, or performance results have been measured yet.

## Positioning

Alan is currently a UI/UX Designer at an IT consulting company. Product Designer is his primary professional positioning and hiring focus. He is developing design engineering capabilities, not claiming established Design Engineer employment history.

His intended practice connects product design with implementation: understand feasibility and constraints, translate design intent into actionable guidance, and implement and refine interactive interfaces. Specific capability claims require evidence from his actual work.

The approved identity phrase is exactly "Design • Engineer". It expresses the relationship between design and engineering; it is not an employment title. Use the definitions in [CONTEXT.md](CONTEXT.md), including design-to-development bridge and later exploration.

## Operating Context

The portfolio supports browsing selected work, opening and returning from case studies, reading concise background, viewing or downloading a resume, and contacting Alan. Direct project visits, modified clicks, new tabs, browser history, and restored scroll positions are part of normal use.

The primary contact action opens an email draft to a verified address; LinkedIn is a secondary option. Resume and professional-profile destinations must be verified. The website does not need a booking service, authentication, a database, a CMS, or a blog.

Case studies establish the user problem, Alan's actual contribution, and consequential design decisions before presenting interaction evidence and implementation considerations. Their depth follows available evidence rather than equal page lengths. About remains concise and covers current work, approach, developer collaboration, learning, and resume access.

## Capabilities and Constraints

- Include the homepage, a separate About page, and complete case studies for Aurelia, Paylecta, PawFriend, and Munchpal. Their categories are hospitality, finance, pet adoption, and food sharing respectively.
- Preserve the approved interaction requirements: scroll-linked role tracks, inline expanding project previews, magnetic clickable controls, an image-inverting cursor, a full-to-compact header, a Sliding Stairs Menu, shared-image project entry/return, and desktop horizontal project media. Detailed behavior and acceptance conditions live in the PRD and spec rather than this product record.
- All actions remain immediately usable while animation runs. Interruption, rapid input changes, route changes, and enhancement failure must preserve navigation and content access.
- Aurelia and PawFriend are self-initiated concept projects. Verify Paylecta and Munchpal status and all project contributions, collaborators, and outcome claims before publishing.
- Selective new demonstrations are permitted as later explorations. Label them clearly and distinguish them from original contributions, production use, and historical testing.
- Keep all four projects. Missing evidence does not authorize fabricated claims or silent scope reduction; identify missing inputs and continue independent work.
- Respect the confirmed PRD and alignment decisions over conflicting older examples or generic design-skill recommendations. This initialization does not reopen the approved direction.

## Brand Commitments

The identity is Alan Sahlan, using the original AS mark, a real portrait, the exact "Design • Engineer" phrase, and an accurate Indonesia location reference. Do not invent a city, coordinates, local-time display, or availability status.

The user updated the typography commitment on 27 September 2026: Plus Jakarta Sans replaces Halyard Display Variable throughout interface text. Retain the warm off-white/charcoal/cobalt identity, and the approved minimal editorial composition. These are existing user commitments, not a new visual direction. Consult the PRD for exact composition, tokens, and interaction references. The referenced mockup does not establish actual project behavior or override the written requirements.

Apply the better-writing skill to all website copy. Use clear, brief prose, consistent terminology, meaningful action labels, and sentence case by default. Preserve deliberate approved identity copy. "Let's work together." and the PRD's About wording are starting copy that may be refined within the confirmed positioning.

## Evidence on Hand

- [PRD v2.1](portfolio-prd-halyard.md) records the approved requirements and external portfolio/reference sources.
- [Confirmed alignment session](.scratch/portfolio-halyard/alignment-session.md) records Alan's positioning and content decisions.
- [Spec revision 2](.scratch/portfolio-halyard/spec.md) records implementation and testing requirements. Twelve approved implementation tickets exist in the local Markdown tracker.
- The supplied portrait and AS mark in `assets/` have been inspected and prepared for the homepage. See [asset provenance](docs/assets.md) for originals, transformations, and remaining inputs.
- [Ticket 02 content sources](docs/portfolio-content.md) records resume inspection, confirmed email/profile destinations, and remaining factual inputs.
- The PRD links to a portfolio Drive folder, Paylecta and Munchpal Behance studies, and Aurelia and PawFriend sites. Those links identify material to investigate, not already-verified evidence.

Plus Jakarta Sans and the updated resume are delivered locally. The approved composition image and remaining project media still require verification before release. Verify them before use; clearly labelled development substitutes do not satisfy release acceptance.

Recheck Paylecta outcome metrics and testimonial/persona provenance, Munchpal task-time/completion figures, and resume accuracy. Remove any AI-directed instruction or keyword block from the release resume if present. Omit unsupported results. Ticket 01 has passing browser tests, lint, type checks, and a production build. See [verification results](.scratch/portfolio-halyard/ticket-01-verification.md) for actual coverage and limits. No performance score or accessibility certification is claimed.

## Product Principles

1. Lead with product design judgment and represent developing engineering capability accurately.
2. Make design-to-development claims assessable through specific decisions and authentic evidence.
3. Treat reliable, interruptible interactions as part of the work visitors evaluate.
4. Preserve complete content and predictable actions across input modes and motion preferences.
5. Let evidence determine detail; distinguish original work, later explorations, and unverified claims.

## Accessibility & Inclusion

Require semantic links/buttons, visible focus, sensible tab order, useful image alternatives, sufficient contrast, and comfortable targets. Decorative repetition and the custom cursor must not be necessary to understand or operate the site.

Support keyboard and touch throughout. Keep magnetic targets stationary and provide stable equivalents for keyboard, touch, reduced motion, and forced colors. Touch project entry takes one tap. Menus require focus containment, Escape dismissal, background inertness, and correct focus/scroll restoration.

Respect reduced motion from initial render and when changed during the session. Preserve full content and immediate actions while disabling the specified spatial effects. Horizontal project media becomes stacked content on narrow screens and reduced motion; focused content remains reachable.

Validate at 390px, 768px, and 1440px, plus a 320px overflow check and intermediate layout widths. Use the confirmed real-browser testing boundary with Playwright, manual interaction review, and short recordings. Report tested coverage and gaps; never imply physical-device coverage from emulation alone. No particular accessibility certification or measured conformance level has been claimed.
