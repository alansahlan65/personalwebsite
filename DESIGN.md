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
    fontFamily: '"Halyard Display Variable", "Helvetica Neue", Arial, sans-serif'
    fontSize: "clamp(5rem, 10.3vw, 10.4rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-.04em"
  headline:
    fontSize: "clamp(1.65rem, 6.6vw, 6.7rem)"
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "-.035em"
  title:
    fontSize: "clamp(2.1rem, 4.3vw, 4.25rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-.035em"
  body:
    fontFamily: '"Halyard Display Variable", "Helvetica Neue", Arial, sans-serif'
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

The approved world uses Halyard Display Variable, warm off-white, charcoal, cobalt, generous gutters, thin dividers, and the original AS mark. Large names and role text carry the hierarchy. The real portrait supplies the photographic material.

This record extracts the current five-section homepage foundation from app/globals.css and app/page.tsx. It covers the ticket 01 homepage foundation, ticket 02 About/contact additions, ticket 03 navigation, ticket 04 Aurelia entry, and ticket 05 pointer feedback, not a complete release. Halyard delivery is missing and the current preview renders a neutral fallback. The approved composition image is unavailable, so this document does not establish an approved pixel match. PRODUCT.md records durable commitments; .impeccable/surfaces/app-page-tsx.md owns this homepage's composition, and docs/assets.md records asset provenance and missing inputs.

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

Halyard Display Variable is the required interface family. The frontmatter records the configured CSS stack, including its development fallbacks. CSS currently resolves Halyard only through local font names and declares weights 100 through 900 with font-display swap. No font file or authorized web-project stylesheet is delivered. The neutral fallback currently visible is not approved display typography.

The display role is the two-line name. The headline role is the three practice lines. The title role is the project name, body is the base interface text, and label is the small section heading. Descendants inherit the configured body family. Regular and medium weights provide the visible hierarchy; project numbers use tabular numerals.

At the 650px breakpoint, the name changes to clamp(2.4rem, 17vw, 6.9rem), practice lines use line-height 1.6, and project names change to clamp(1.5rem, 8vw, 3rem). The About statement uses clamp(1.65rem, 2.6vw, 2.65rem), line-height 1.3, and letter-spacing -.025em. The contact heading uses clamp(3.4rem, 7.5vw, 7.6rem), weight 400, line-height 1.02, and letter-spacing -.04em; its narrow-screen size is clamp(2rem, 14vw, 4rem).

**The Font Delivery Rule.** Preserve Halyard as the required family and recheck wrapping, spacing, and hierarchy when its authorized web delivery is available.

## Layout

The common container is centered, capped at 1440px, with twice the gutter token subtracted from available width. Section padding provides the rhythm; there is no general spacing scale beyond the shared gutter.

The homepage has a header followed by hero, practice lines, selected work, About, and contact footer. The hero uses a 1.15fr / 1fr grid and a 690px minimum height. Its portrait is at most 480px wide. About uses a 1fr / 2fr grid with a 780px maximum copy width. Project rows use number, title, and category columns, with a 140px minimum height.

At 1000px and below, the hero minimum height becomes 570px and About changes to 1fr / 2.6fr. At 650px and below, navigation wraps beneath the brand, hero and About become single columns, location returns to normal document flow, and project categories move beneath titles. Project rows then have a 110px minimum height. The footer stacks its lower content vertically. These are observed homepage arrangements, not mandatory compositions for later pages.

## Elevation & Depth

The current homepage has no shadows, blur, floating cards, or elevation scale. Large color fields, spacing, image cropping, and thin rules separate content.

**The Flat Surface Rule.** Preserve the current flat treatment when extending this homepage.

## Shapes

Portrait and location badge frames are square-cornered. No radius tokens are defined. The desktop portrait uses a 4:5 aspect ratio; narrow screens use 1:1.08. Its image is cropped with object-fit cover, object-position 50% 85%, a 150% height, and a -50% top offset.

The portrait's top-right cobalt corner has 35px arms with 8px borders. The About corner has 16px arms with 4px borders. These are decorative marks. Forced-colors mode switches their border color to CanvasText and adds a border to the location badge.

## Components

The primary navigation consists of plain text anchors with 44px minimum height and underline on hover. Links show a 2px current-color focus outline offset by 6px. The full-row Aurelia link uses a -4px inset offset so its focus rectangle stays inside the ruled row. Resume is currently a muted, unavailable span. The skip link becomes visible on focus. The original AS image accompanies the name in the home links.

The location badge is a small cobalt square labelled ID beside the Indonesia text. It is not a clickable control.

Project rows are a ruled ordered list of four projects. Number and category use muted text. Aurelia is a single full-row link: its screenshot expands inline on mouse or keyboard focus, stays visible on touch and with reduced motion, and opens the direct case-study route. The other rows remain static until their case studies exist.

About pairs a small label with a large statement, decorative corner, and More about me link. The separate About page uses a 900px reading width and ruled label/body rows that stack below 650px. The contact section uses a full cobalt field with the heading and unboxed arrow as one mailto action, followed by the email address and professional links. Resume remains unavailable until a current PDF is verified.

The header keeps its full navigation at the top and shows a fixed compact Menu trigger after scrolling past 96px. It returns to full below 48px, deferring changes while a header control has focus. The five-panel Sliding Stairs Menu reveals Work, About, and Contact links, with confirmed professional destinations below. Resume remains a visible unavailable label until a current PDF is verified. The dialog contains focus, makes the page inert, restores scroll and trigger focus on dismissal, and follows reduced-motion changes during the session. The stairs transition lasts up to 620ms; hover strips stop on exit and close.

Current actions use stationary semantic targets with separate moving children. Motion springs use stiffness 100, damping 10, and mass 1, capped at 5px for text, 6px for project title/arrow, and 12px for large controls. Gallery width and menu marquee transforms belong to separate wrappers. Focus and press feedback remain available on keyboard, touch, reduced motion, and forced colors.

The decorative cursor follows actual pointer coordinates as a small dot, expands to a 72px white difference-blend disc over imagery, and adds a separate outlined arrow over actionable images. It yields to text selection and resets on route/menu changes, window exit, touch, preference changes, and hidden tabs. Native cursor hiding starts only after the enhancement is ready. See docs/pointer-interactions.md for the action inventory and compositing evidence.

Scroll-linked role tracks, previews for the remaining projects, shared-image route transitions, and horizontal project media are not implemented in this foundation.

## Do's and Don'ts

### Do:

- Do preserve the exact Design • Engineer identity phrase.
- Do retain the supplied AS mark and real portrait with their documented provenance.
- Do keep visible keyboard focus and native anchor access.
- Do recheck the design after Halyard is delivered.

### Don't:

- Don't promote the current neutral fallback to approved typography.
- Don't describe the remaining static project rows or the pending resume as completed interactions.
- Don't claim a pixel match to the missing composition image or a complete release.
