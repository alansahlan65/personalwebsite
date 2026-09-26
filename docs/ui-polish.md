# UI polish across the portfolio

Reviewed and implemented on 26 September 2026 with better-ui. Scope: Home `/`, About `/about`, Aurelia `/work/aurelia`, and their shared header/menu/footer. Starting commit: `e892571`.

## Icons and state feedback

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `app/components/ui-icons.tsx:10`, arrow wrappers in `site-header.tsx`, `site-footer.tsx`, `project-gallery.tsx`, `return-to-work-link.tsx`, `case-media-sequence.tsx`, `app/page.tsx`, `app/work/aurelia/page.tsx` | Font glyphs with different proportions; back action had an outward arrow | Shared currentColor outline SVGs; back arrow leads its label, forward/downward directions match the action | Consistent icon weight and clear direction across pages |
| MEDIUM | `app/components/site-header.tsx:32` | Closing changes the control label to Open while retaining the close glyph | Close/reopen icons cross-fade with scale 0.25–1, opacity 0–1, blur 4–0 px; Motion spring duration 0.3, bounce 0; initial=false | Contextual icon matches the current action and can reverse during interruption |
| MEDIUM | `app/globals.css:202` | Current About page was marked in full navigation but had no visible expanded-menu cue | Underline plus a subtle surface cue on the current menu row | Static state cue remains visible alongside motion |
| LOW | `app/globals.css:171`, `app/components/site-header.tsx:32` | Menu controls dimmed on press | Visual contents scale to exactly 0.96 over 150 ms ease-out; semantic button stays fixed; static prop can disable the scale | Tactile feedback preserves the hit area |

Hover color/background transitions name their properties and use 150 ms ease-out. Touch avoids desktop hover fills. Reduced motion disables press scaling/transitions and uses a stationary icon. Existing unavailable Resume labels remain explicit and noninteractive.

## Surfaces

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| LOW | `app/globals.css:29` | Photos and interface captures met the canvas without a consistent edge | 1 px inset outline in pure black at 10% opacity on portrait, gallery, role photos, case media, and recording | Consistent image separation without changing dimensions or radius |
| LOW | `app/globals.css:178` | Fixed menu control had the same depth as page content | Two transparent shadow layers; existing structural border retained | Elevation identifies the floating control over text and media |

Forced colors use CanvasText outlines and remove the shadow. Photo capsules keep their existing rounded shape; the portrait and case-study frames retain their rectangular geometry. Transparent logo assets keep their original treatment.

## Optical alignment

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| LOW | `app/globals.css:161`, `app/globals.css:189`, `app/globals.css:135` | Symmetric icon-button padding, variable close-label width, and baseline footer arrow | Icon-side padding is 2 px less; close/reopen label space is reserved; footer arrow centers beside the two-line invitation | Stable button content and balanced directional icons |

## Verification

- Browser walkthrough and screenshots of all three pages at 1440 × 900 and 390 × 844; shared menu/current-page state, footer, hover, keyboard focus, press/release, rapid close/reopen, and runtime reduced motion inspected.
- During press, the button remained at the same measured rectangle, 93.921875 × 44 px. Its visual scale was 0.96; reduced-motion scale was 1. The walkthrough reported no page errors. [State record](../.scratch/ui-polish/demos/state-checks.json).
- The native opacity/filter icon tracks were paused and scrubbed by 15 ms every 150 ms of wall time, with reversal halfway through. Only the inspection browser extended the menu phase timer to hold the control for review. [Slow icon replay](../.scratch/ui-polish/demos/menu-ten-percent.webm). JavaScript scale/stairs motion was inspected at normal speed.
- 52 affected interaction tests passed in development. The full production Chromium run passed 92 tests and timed out in two role-track evaluations during a simultaneous browser stall. Those two passed unchanged on a focused rerun, 2/2 in 2.7 seconds. All 94 cases have passing coverage; this was not a single 94/94 full-suite result.
- Typecheck, lint, and production build pass. Existing suites cover required widths 320–1440 px, enlarged text, keyboard, emulated touch, forced colors, preference changes, native links, menu interruption, shared entry, media loading, and route cleanup.

Screenshots are in [the review evidence folder](../.scratch/ui-polish/demos). The interface has no asynchronous loading/submission controls added by this polish; lazy image states and unavailable project/resume states remain covered by source review and browser checks.

**Not verified:** JavaScript-driven scale/stairs motion at 10% speed; delivered Halyard rendering because the font remains unavailable; other browser engines and physical touch devices. The screenshots use the existing neutral fallback. These limits are outside the inspected Chromium states.

No actionable UI-polish findings remain in the inspected pages and states. Approve.
