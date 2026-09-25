# Ticket 03 verification

Implementation began from commit `517202c`. Verified 2026-09-25.

## Delivered

The header shows brand and primary navigation at the top on wide and narrow screens. It changes to a fixed compact Menu trigger above 96px of scroll and returns to the full header below 48px. The header keeps its layout space, and a focused full-header or compact control defers a mode change. Hidden controls leave keyboard navigation.

The menu uses five staggered ink panels that uncover the cobalt navigation field. Work, About, and Contact are native links. LinkedIn, GitHub, and Behance use the confirmed destinations. Resume stays visible as unavailable until a current, cleaned PDF or verified URL is supplied. Pointer hover shows one decorative repeating label/logo strip per row; the strip stops on exit or the start of closure.

The labelled dialog traps Tab, makes the background inert, locks the saved scroll position, handles Escape, and returns focus to its trigger on dismissal. Links can navigate during opening. Same-page menu links focus their destination; route changes use the existing route-focus behavior. Modified clicks keep browser new-tab behavior. Reduced motion works at load and when changed during a session.

## Checks

| Check | Result |
| --- | --- |
| Full Playwright suite | 34 Chromium tests passed |
| ESLint | Passed |
| TypeScript | Passed |
| Production build | Passed; / and /about statically prerendered |
| Scroll and interruption | Threshold oscillation, focused controls, Escape during opening, rapid reversal, restored scroll, and refresh |
| Navigation | Early activation, same-page focus, route focus, modified click, Back, and no residual lock or overlay |
| Accessibility and input | Focus containment, background inertness, hidden controls, reduced-motion change, touch-compatible links |
| Responsive | 320px overflow test, 390px open-menu resize, existing home/About width coverage |

The [short Chromium demonstration](demos/header-menu.webm) records compact entry, the panel reveal, row hover, and dismissal at 1440 × 900. Opening and intermediate frames plus the 390px menu were visually inspected. This is browser emulation, not physical-device, Safari, Firefox, or assistive-technology certification.

## Review

The two-axis review found a shadow that conflicted with DESIGN.md's Flat Surface Rule, and three functional gaps: compact-trigger focus during upward scroll, panels drawn behind content, and hover strips running during close. All four were corrected and the browser suite was rerun. It also noted a small duplication between the two trigger buttons; their separate visibility and focus behavior make the shared two-line label/icon markup reasonable here.

## Remaining input

Ticket 03 remains `needs-info` for a current, cleaned resume PDF or verified resume URL. The existing source resume was withheld in ticket 02 because it is outdated and contains hidden AI-directed text. Halyard Display Variable web delivery remains an earlier design input; the menu inherits the configured Halyard-first stack but currently renders the fallback where Halyard is unavailable.
