---
name: Alan Sahlan portfolio
description: Current homepage foundation in the approved minimal editorial direction.
colors:
  canvas: "#f6f5f1"
  ink: "#20221f"
  muted: "#62625e"
  cobalt: "#245bff"
  divider: "#ddddd5"
typography:
  display:
    fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "clamp(5rem, 10.3vw, 10.4rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-.03em"
  headline:
    fontSize: "clamp(1.65rem, 6.6vw, 6.7rem)"
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "-.035em"
  title:
    fontSize: "clamp(2.1rem, 4.3vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.03em"
  body:
    fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "1rem"
  label:
    fontSize: ".9375rem"
    fontWeight: 500
    lineHeight: 1.5
spacing:
  gutter: "clamp(1.5rem, 5vw, 5rem)"
components:
  primary-nav:
    textColor: "{colors.ink}"
  location-badge:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    width: "36px"
    height: "36px"
  project-row:
    textColor: "{colors.ink}"
    padding: "1.5rem 0"
  about-copy:
    textColor: "{colors.ink}"
    padding: "2rem 0 0"
  contact:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.canvas}"
    padding: "5.5rem 0 1.5rem"
---

# Design System: Alan Sahlan portfolio

## Overview

**Creative North Star: "Minimal editorial portfolio"**

The user-approved typography update of 27 September 2026 uses Plus Jakarta Sans, warm off-white, charcoal, cobalt, generous gutters, thin dividers, and the original AS mark. Large names and role text carry the hierarchy. The real portrait supplies the photographic material.

This record extracts the current five-section homepage foundation from app/globals.css and app/page.tsx. It covers the ticket 01 homepage foundation, ticket 02 About/contact additions, ticket 03 navigation, ticket 04 Aurelia entry, ticket 05 pointer feedback, and ticket 06 project entry, not a complete release. Plus Jakarta Sans is now self-hosted through next/font/local, replacing the prior Halyard requirement at the user’s request. The approved composition image is unavailable, so this document does not establish an approved pixel match. PRODUCT.md records durable commitments; .impeccable/surfaces/app-page-tsx.md owns this homepage's composition, and docs/assets.md records asset provenance and missing inputs.

**Key Characteristics:**

- Warm off-white and charcoal with one cobalt accent.
- Large, tightly spaced typography and generous section spacing.
- Rectangular photography, thin dividers, and small cobalt corners.
- Native links connect the homepage, About page, email action, and confirmed professional profiles.

## Colors

### Primary

Cobalt marks the name period, the identity phrase separator, one role line, location badge, decorative corners, selection, and the full contact background.

**The Accent Rule.** Use cobalt for the established identity details and contact field; preserve the original AS mark's supplied blue shading.

### Neutral

Canvas is the page background and text on cobalt. Ink is the main text. Muted is secondary information and unavailable navigation. Divider separates the role section and project rows.

The portrait's backing color is a component-specific image placeholder. The contact divider uses translucent canvas. Neither establishes an additional palette or tonal ramp.

## Typography

Plus Jakarta Sans is the required interface family, replacing Halyard at the user’s request on 27 September 2026. Its variable font is bundled as WOFF2 and loaded by next/font/local with weights 200–800, swap display, preloading and an adjusted fallback. The source and SIL Open Font License are in app/fonts/. No font CDN is requested by visitors.

The display role is the two-line name. The headline role is the three practice lines. The title role is the project name, body is the base interface text, and label is the small section heading. Descendants inherit the configured body family. Regular and medium weights provide the visible hierarchy; project numbers use tabular numerals.

The three practice lines use the user-selected Streamline Plump Gradient icons: feather pen, monitor, and stars. Their supplied green/blue and pink/blue gradients are approved local accents. Icons have transparent square frames sized from 48px to 112px, preserving the role tracks' existing scroll behavior and static reduced-motion layout. They replace the earlier pill-shaped photographs. The footer includes Streamline attribution.

At the 650px breakpoint, the name changes to clamp(2.4rem, 17vw, 6.9rem) and project names change to clamp(1.5rem, 8vw, 3rem). Display headings and project names use letter-spacing -.03em on desktop and -.02em on narrow screens. Practice lines retain line-height 1.22 and tracking -.035em. The About statement uses clamp(1.65rem, 2.6vw, 2.65rem), line-height 1.3, and letter-spacing -.025em. The contact heading uses clamp(3.4rem, 7.5vw, 7.6rem), weight 400, and line-height 1.02; its narrow-screen size is clamp(2rem, 14vw, 4rem).

**The Font Delivery Rule.** Preserve the bundled Plus Jakarta Sans family and verify actual font loading and wrapping after typography changes.

## Layout

The common container is centered, capped at 1440px, with twice the gutter token subtracted from available width. Section padding provides the rhythm; there is no general spacing scale beyond the shared gutter.

The homepage has a header followed by hero, practice lines, selected work, About, and contact footer. The hero uses a 1.15fr / 1fr grid and a 690px minimum height. Its portrait is at most 480px wide. About uses a 1fr / 2fr grid with a 780px maximum copy width. Project rows use number, title, and category columns, with a 140px minimum height.

At 1000px and below, the hero minimum height becomes 570px and About changes to 1fr / 2.6fr. At 650px and below, navigation wraps beneath the brand, hero and About become single columns, location returns to normal document flow, and project categories move beneath titles. Project rows then have a 110px minimum height. The footer stacks its lower content vertically. These are observed homepage arrangements, not mandatory compositions for later pages.

## Elevation & Depth

Large color fields, spacing, image cropping, and thin rules separate content. The approved Apple-design pass gives the compact Menu trigger a 92% warm-canvas surface, static 12px backdrop blur, soft border, and restrained shadow. Reduced transparency, increased contrast, forced colors, and browsers without backdrop filtering receive a solid surface.

**The Flat Surface Rule.** Keep content sections flat. The floating compact Menu trigger is the approved exception for functional navigation depth.

## Shapes

Portrait and location badge frames are square-cornered. No radius tokens are defined. The desktop portrait uses a 4:5 aspect ratio; narrow screens use 1:1.08. Its image is cropped with object-fit cover, object-position 50% 85%, a 150% height, and a -50% top offset.

The portrait's top-right cobalt corner has 35px arms with 8px borders. The About corner has 16px arms with 4px borders. These are decorative marks. Forced-colors mode switches their border color to CanvasText and adds a border to the location badge.

## Components

The primary navigation consists of plain text anchors with 44px minimum height and underline on hover. Links show a 2px current-color focus outline offset by 6px. The full-row Aurelia link uses a -4px inset offset so its focus rectangle stays inside the ruled row. Resume is a native download link to the verified, locally served one-page PDF. The skip link becomes visible on focus. The original AS image accompanies the name in the home links.

The location badge is a small cobalt square labelled ID beside the Indonesia text. It is not a clickable control.

Project rows are a ruled ordered list of four projects. Number and category use muted text. Aurelia is a single full-row link: its screenshot expands inline on mouse or keyboard focus, stays visible on touch and with reduced motion, and opens the direct case-study route. The other rows remain static until their case studies exist.

About pairs a small label with a large statement, decorative corner, and More about me link. The separate About page leads with Product Designer positioning and a real portrait, followed by ruled sections for CADIT, an Aurelia example, approach, and resume. The hero stacks below 850px and the ruled sections below 650px. The contact section uses a full cobalt field with the heading and unboxed arrow as one mailto action, followed by the email address and professional links. Resume download is available in the header, menu, About body and footer.

The header keeps its full navigation at the top and shows a fixed compact Menu trigger after scrolling past 96px. It returns to full below 48px, deferring changes while a header control has focus. Wheel/touch scroll changes fade the compact trigger over 120ms, or 80ms with reduced motion; keyboard and restored-page changes remain immediate. The five-panel Sliding Stairs Menu reveals Work, About, and Contact links, with confirmed professional destinations below. Resume is a native PDF download. Contact targets the current page’s footer. The dialog contains focus, makes the page inert, restores scroll and trigger focus on dismissal, and follows reduced-motion changes during the session. Each panel moves over 380ms with a 55ms stagger. Menu phases settle after all five panels report completion, rather than a fixed timer. Interrupted transitions retarget their live transforms; hover strips stop on exit and close.

Current actions use stationary semantic targets with separate moving children. Magnetic springs use stiffness 100, damping 20, and mass 1 for a critically damped settle, capped at 5px for text, 6px for project title/arrow, and 12px for large controls. Gallery width and menu marquee transforms belong to separate wrappers. The contact arrow scales to .97 over 120ms on pointer-down and returns over 160ms; reduced motion substitutes an 80ms opacity change to .85. Cancellation clears its pressed state, and keyboard focus remains stationary. Focus and press feedback remain available on keyboard, touch, reduced motion, and forced colors.

The decorative cursor follows actual pointer coordinates as a small dot, expands to a 72px white difference-blend disc over imagery, and adds a separate outlined arrow over actionable images. It yields to text selection and resets on route/menu changes, window exit, touch, preference changes, and hidden tabs. Native cursor hiding starts only after the enhancement is ready. See docs/pointer-interactions.md for the action inventory and compositing evidence.

Aurelia's preview and hero share a React ViewTransition identity. Gallery links carry the project-entry transition type; menu navigation and return links keep their existing behavior. The browser morph lasts 520ms with cubic-bezier(.77, 0, .175, 1). The title settles over 220ms with cubic-bezier(.23, 1, .32, 1). Both image slots preserve 16:10 cropping. The hero follows the introduction so its destination is visible during entry, before the project facts and live link. The snapshot overlay passes pointer events through, and reduced motion, touch, and forced colors remove spatial entry. See docs/project-entry.md for fallback behavior and the recording.

Ordinary navigation between Home, About, and Aurelia uses a 220ms page crossfade with cubic-bezier(.23, 1, .32, 1). Each page owns an enter/exit boundary; same-page anchors and ordinary state updates do not replay it. Gallery entries retain their shared-image transition without a simultaneous page fade. Cached browser Back/Forward navigation receives an incoming opacity fade without intercepting history. Touch receives the page crossfade; reduced motion shortens snapshot opacity changes to 80ms and forced colors uses immediate pages. Live-page history restores remain opaque under either accessibility preference. Selected-work scroll restoration runs before the destination snapshot. Snapshot overlays pass pointer input through, and navigation and focus do not wait for animation. See docs/page-transitions.md.

Scroll-linked role tracks, previews for the remaining projects, and horizontal project media are not implemented in this foundation.

## Do's and Don'ts

### Do:

- Do preserve the exact Design • Engineer identity phrase.
- Do retain the supplied AS mark and real portrait with their documented provenance.
- Do keep visible keyboard focus and native anchor access.
- Do preserve the user’s Plus Jakarta Sans typography choice and local font delivery.

### Don't:

- Don't treat the fallback as evidence that the intended font loaded.
- Don't describe remaining static project rows as completed case studies.
- Don't claim a pixel match to the missing composition image or a complete release.


## About refinement, 27 September 2026

The hero headline is “Product Designer. Closer to the build.” CADIT, October 2025–present, and its component-library/UI-mockup work are user-confirmed. Aurelia is linked as a solo design-and-build example; no historical metrics are added. The portrait reuses the supplied homepage crop. A slanted cobalt underline, image zoom and arrow response add restrained detail. Hover motion is limited to fine pointers and disabled with reduced motion.

The shared header wraps by intrinsic content width, with full navigation on a second row below 900px. Work/About targets are at least 44px wide. Menu buttons are enhanced only after hydration; native links and resume access remain available without JavaScript. The footer notice now concerns remaining case studies, and its reading width is capped. The font change also affects Home and Aurelia; their interactions require regression verification.
