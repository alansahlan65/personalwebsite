---
name: Alan Sahlan portfolio
description: The implemented cobalt-led editorial portfolio and its shared tactile controls.
colors:
  canvas: "#f6f5f1"
  ink: "#20221f"
  muted: "#62625e"
  cobalt: "#245bff"
  action-ink: "#245bff"
  divider: "#ddddd5"
  field-surface: "#fff"
  surface: "#f0efe9"
  accent-solid: "#245bff"
  on-accent: "#fff"
  error: "#ad321d"
  cobalt-hover: "#1749db"
  surface-raised: "#fffefa"
  surface-accent: "color-mix(in srgb, var(--cobalt) 6%, var(--surface-raised) 94%)"
  surface-accent-strong: "color-mix(in srgb, var(--cobalt) 14%, var(--surface-raised) 86%)"
  canvas-dark: "#171917"
  ink-dark: "#f6f5f1"
  muted-dark: "#b6b8b1"
  action-ink-dark: "#f6f5f1"
  divider-dark: "#444840"
  surface-dark: "#22251f"
  field-surface-dark: "#22251f"
  surface-raised-dark: "#252924"
  error-dark: "#ffab98"
typography:
  display:
    fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "clamp(5rem, 10.3vw, 10.4rem)"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-.03em"
  headline:
    fontSize: "clamp(3.4rem, 7.5vw, 7.6rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-.03em"
  title:
    fontSize: "clamp(1.65rem, 4.2vw, 2.75rem)"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-.03em"
  body:
    fontFamily: '"Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "1rem"
  label:
    fontSize: ".9375rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  control: "16px"
  field: "16px"
  preview: "16px"
  card: "28px"
  pill: "999px"
spacing:
  unit: "4px"
  scale: "4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 112, 128px"
  gutter: "round(nearest, clamp(24px, 5vw, 80px), 8px)"
  content-gap: "24px"
  content-group-gap: "32px"
  section-space: "round(nearest, clamp(48px, 5vw, 80px), 8px)"
  section-heading-gap: "round(nearest, clamp(24px, 2vw, 32px), 8px)"
components:
  primary-nav:
    textColor: "{colors.ink}"
  location-badge:
    backgroundColor: "{colors.accent-solid}"
    textColor: "{colors.on-accent}"
    width: "36px"
    height: "36px"
  project-row:
    textColor: "{colors.ink}"
    padding: "round(nearest, clamp(.75rem, 2vw, 1.5rem), 4px) 0"
  about-copy:
    textColor: "{colors.ink}"
    padding: "2rem 0 0"
  contact:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    padding: "64px 0 24px; 48px top on phones"
  contact-submit:
    backgroundColor: "{colors.accent-solid}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
    height: "54px"
  contact-submit-hover:
    backgroundColor: "{colors.cobalt-hover}"
  contact-field:
    backgroundColor: "{colors.field-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "16px 16px"
  copy-action:
    backgroundColor: "{colors.surface-accent}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.pill}"
    padding: "12px 16px"
    height: "48px"
  menu-control:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 8px 8px 12px"
    height: "48px"
  theme-switch:
    backgroundColor: "{colors.surface-accent}"
    rounded: "{rounded.pill}"
    width: "88px"
    height: "48px"
  notebook-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "round(nearest, clamp(20px, 3vw, 28px), 4px)"
  motion-demo-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "round(nearest, clamp(20px, 2vw, 28px), 4px)"
---

# Design System: Alan Sahlan portfolio

Reviewed 19 October 2026 against the implemented site. [PRODUCT.md](PRODUCT.md) owns scope and professional positioning. This file owns shared visual rules; [the documentation index](docs/README.md) points to current surface and behavior records.

## Overview

Use a minimal editorial composition: warm off-white, charcoal, exact cobalt, Plus Jakarta Sans, generous gutters, thin dividers, the original AS mark, and large identity text. Home uses Alan's voxel character; About retains his real portrait. Original project screens provide evidence; generated gallery artwork is decorative.

Reading sections stay flat. Interactive cards and painted controls use neutral raised surfaces, soft blue supporting layers, rounded geometry, and restrained depth. Page composition follows the current implementation; the unavailable original composition image establishes no pixel-match claim.

## Colors and themes

The frontmatter records shared color values. Cobalt stays `#245bff` in both themes, including large identity details and filled actions. Filled cobalt actions use white text. Small action text/icons use `--action-ink`: cobalt in light mode and ink in dark mode. Supporting surfaces mix 6% or 14% cobalt into the current raised neutral.

Light is the default regardless of device preference. The theme switch remembers explicit choices under `portfolio-theme-v1` when storage is available. An early script selects the stored theme; tabs synchronize changes. Footer and menu use the selected canvas. No-JavaScript pages stay light; print uses light surfaces. Role blobs and supplied gradient icons retain their local colors. The logo keeps its supplied blue shading and warm backing.

Use shared field, error, focus, divider, and raised-surface tokens. Keep readable system outlines in forced colors and remove shadows when the preference requires it. See [theme behavior](docs/site-themes.md).

## Typography

Bundle `app/fonts/PlusJakartaSans-Variable.woff2` through `next/font/local`, weights 200–800, with swap display and adjusted fallback. The SIL Open Font License remains beside it. No browser font-CDN request is required. [Asset provenance](docs/assets.md) records the upstream source.

The frontmatter records the shared display, headline, project-title, body, and label roles. Keep component-specific responsive declarations in their owning CSS. Main text starts at 1rem; helper text, captions, and tour descriptions use at least .875rem where specified. Local metadata and compact secondary labels retain their existing hierarchy. Project numbers and progress use tabular numerals.

Verify actual loading, wrapping, enlarged-text reflow, and intermediate widths after typography changes. Original project artwork retains its source typography.

## Spacing and layout

All page and component padding follows the 4/8px scale. Use shared tokens for repeated spacing. The current fixed space tokens are 4, 8, 12, 16, 20, 24, 32, 48, and 64px; larger fluid gaps use the formulas below. Other scale values may be local lengths without adding unused root tokens.

| Role | Rule |
| --- | --- |
| Page width | `min(100% - var(--gutter) * 2, 1440px)`, centered |
| Gutter | `round(nearest, clamp(24px, 5vw, 80px), 8px)` |
| Related text | 12–16px |
| Content gap | `--content-gap`, 24px |
| Group gap | `--content-group-gap`, 32px |
| Section gap | `--section-space`, `round(nearest, clamp(48px, 5vw, 80px), 8px)` |
| Section heading | `--section-heading-gap`, `round(nearest, clamp(24px, 2vw, 32px), 8px)` |
| Source group | One 48px gap after the conclusion/disclosure |
| Ruled reading group | 32px padding |
| Expanded case notes | 24px top and 32px bottom |
| Page ending | 48px before the footer |

A continuous case-study section owns one leading gap. Clear its last child's trailing margin and avoid stacking equal trailing/leading padding. Keep captions beside their figures. Mixed content explicitly owns sibling gaps, including 32px after a results list's final divider. Fluid gutters and section spacing round to 8px at intermediate widths.

Home's desktop hero uses a 1.15fr/1fr split; the phone hero becomes a compact single column. The 4:5 phone character frame is capped at 152px. About pairs introduction/portrait, capabilities/experience, and learning/comparison before a compact trivia section. Those pairs stack at 760px and also respond to their text-relative container width. Contact stacks below 950px; name/email stack below 600px.

Selected work has four ruled rows. The same 3:1 cover moves from a right-hand thumbnail to a full preview below its title, with the short story underneath. At 700px and below or on non-hover devices, covers and stories remain visible. [Selected work](docs/selected-work.md) owns its local geometry.

Aurelia, Paylecta, and Munchpal read continuously through original screens. Broad screen/phone compositions stack below 48rem. PawFriend's horizontal enhancement requires at least 1000px width, 750px height, normal motion, no forced colors, and enough measured room for all panels. Otherwise it retains a complete stack. See [case media](docs/case-media.md).

## Shapes and depth

Shared radii are 16px for controls/fields/previews, 28px for interactive cards, and 999px for pills. Route-specific project device frames retain their local 16px panels, 12px asset treatment, and 8px set geometry. Source artwork retains its original corners.

The About portrait and location badge remain square. Home's character uses transparent layered artwork. Menu/theme/copy/resume-return controls use the established pills; the footer arrow uses a circle. Decorative cobalt corners and logo backing retain their local geometry.

Use `--shadow-control` for painted controls and `--shadow-card` for interactive cards. These have theme-specific soft layers. Keep the compact navigation strip solid, without blur. Reading text and original evidence do not become raised cards.

## Components and interaction

### Header and navigation

Keep Home, About, Contact, and Download resume in full navigation at the top. Resume actions use a PDF cue and the verified local file. Primary links have 44px minimum targets, current-page indication, and visible focus.

Compact navigation enters above 96px scroll and returns below 48px, deferring changes during header focus or an open menu. Its fixed strip reserves safe-area space. The theme switch sits immediately left of Menu and dialog Close with a .75rem gap. The menu scrolls vertically and contains focus, supports Escape, makes the background inert, and restores focus/scroll correctly.

The menu's five panels move vertically. Page navigation uses five sharp horizontal bands, a 610ms combined budget, 30ms stagger, and `cubic-bezier(.65,0,.35,1)`. Keyboard activation bypasses the curtain; reduced motion uses an 80ms fade; forced colors navigates immediately. Gallery entry requests the shared-image effect independently. [Navigation](docs/page-transitions.md) owns the complete lifecycle.

### Stationary targets and motion

Magnetic feedback moves separate visual children, capped at 5px for text, 6px for gallery title/arrow, and 8px for controls. Its spring is stiffness 100, damping 12, mass .8. `ControlVisual` presses painted button children to .97 with the shared 320/30 spring. Semantic targets, focus outlines, and click coordinates stay still. Reset movement on cancellation, focus, hidden documents, disabled state, and relevant preference changes.

The decorative cursor is a 7px dot at the actual fine-pointer position. Over imagery it expands to a 72px difference-blend disc; actionable imagery gets a separate arrow. Text selection, fields, disclosures, media controls, and local-feedback actions keep appropriate native behavior. Touch, reduced motion, and forced colors use the native cursor. See [pointer behavior](docs/pointer-interactions.md).

Home reveals later content once with a 24px rise and 500ms fade. Initially visible content, restored positions, keyboard access, direct sections, no JavaScript, and motion/color preferences remain immediately readable. The remaining soft About-detail entrance is opacity-only. Pages without matching entrance targets skip observer/listener setup.

### Home and project entry

Product Designer is the default role. Design Engineer describes learning; Interaction Designer describes exploration. Role instructions and local supplied icons support hover/focus/tap. The blob smiles only for its own hover/focus/instruction state; ordinary role activation retains idle blinking. Blinks pause offscreen and in hidden tabs, and settle for motion/color preferences.

The character selects rendered head directions and greets within its own frame. Separate, normalized additive blends prevent interrupted head/body/arm transitions from fading out. [The character record](docs/alan-character.md) owns artwork and timing.

Gallery layout projection uses 280ms and `cubic-bezier(.23,1,.32,1)`, immediate for keyboard and reduced motion. Focus wins over hover. Project entry uses the existing 520ms shared-image curve and 220ms title settle when supported. [Project entry](docs/project-entry.md) owns fallback and return behavior.

### About

Professional content precedes personal trivia. Inline sketches reveal on hover, focus, or tap; pinned previews fit below the compact header and retain an inner keyboard scroller. The portrait greeting supports Escape without requiring focus movement.

The local Static / Motion save comparison keeps state while switching modes. Preferences override movement. Trivia uses a neutral 28px front card and blue supporting layers, whole-card drag, sideways selection, answer buttons, and Next question. Cancelled gestures and viewport changes restore the card. Answer transitions and height changes settle immediately for keyboard and preferences. No-JavaScript and print views retain the facts. See [About](docs/about.md).

### Contact and footer

Fields use visible labels, 16px corners, a 54px minimum height, theme-aware surfaces, inline errors, and cobalt focus. The submit is a 54px cobalt pill; copy actions are 48px supporting-blue pills. Pending clipboard actions disable until settled; input changes invalidate stale responses. Failure reveals selected manual-copy text while preserving the draft. [Contact](docs/contact-page.md) owns delivery and recovery.

The footer uses the selected canvas, thin divider, cobalt invitation, and filled circular arrow to Contact. Its compact Contact-page version avoids repeating the invitation. Respect the bottom safe-area inset.

### Case evidence

Lead with a short project introduction and three facts. Explain decisions once beside original screens. Put research methods, factual build notes, recordings, and extra screens in native ruled disclosures with 44px summary targets. Preserve source links and intrinsic image dimensions.

`ProjectScreen` displays originals or compressed SVG previews and links to the original. PawFriend's media sequence uses named native links, progress, keyboard access, and a focus-only Skip. Wide cropped details retain native panning on phones and complete-original disclosures. Original rasters and SVG photograph fills retain source-resolution limits.

Munchpal's Residents / Volunteers selector uses native radios, the 250ms selection duration, and `cubic-bezier(.77,0,.175,1)` over its longer travel. A clipped active-label layer keeps text aligned; keyboard and preferences settle immediately. Both flows remain available without JavaScript and print includes both.

## Guardrails

Preserve authentic evidence, current professional positioning, source provenance, and complete reading fallbacks. Keep generated artwork separate from original project work. Use shared tokens before adding local variants. Preserve drafts, stationary targets, focus, and native navigation when enhancements stop. Record measured coverage and limits in [quality checks](docs/quality.md).
