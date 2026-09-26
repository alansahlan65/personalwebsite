# Project entry

Ticket 06 implements I-07 for Aurelia. `ProjectImageTransition` assigns the preview and hero the same React ViewTransition name. The gallery's native Next.js Link supplies the `project-entry` transition type. No click is prevented and no timer delays navigation. The installed Next.js view-transition guide supports this through the App Router without additional configuration.

## Ownership and recovery

- Motion owns the gallery preview's outer width. Its inner media has fixed responsive 16:10 dimensions and receives the shared identity.
- The browser owns the shared-image snapshots. The destination image uses the same asset and 16:10 crop. The hero follows the introduction, ahead of the project facts, so it participates in the first viewport.
- Magnetic transforms remain on the title and arrow children. A navigation event clears cursor/magnetic feedback before snapshot capture; the existing pathname effect also resets them on route changes.
- The title has a short CSS transform/opacity settle. It is outside the magnetic and image transform owners.
- Snapshot pointer events pass through to the destination. The heading receives meaningful focus immediately, and return links can be used while the image is moving.
- Only a gallery entry requests shared motion. Menu navigation keeps its coordinated stairs close. History and return links preserve the existing focus and selected-work scroll restoration without stacking entry motion.

Missing source media, unavailable browser support, failed/skipped snapshot capture, touch, direct loads, and new tabs all use the same native route and content. React/browser support determines whether a matching snapshot can animate. An unmatched snapshot does not prevent the project from opening. Modified clicks retain normal browser behavior. Reduced motion, touch, and forced colors remove snapshot animation and the title's spatial settle through media queries, including preference changes during a transition.

## Visual and timing evidence

Manually inspected source, intermediate, and settled screenshots in Chromium at 1440 × 900, device scale 1, on 26 September 2026, using the current fallback font:

| Browser-reported item | Measurement |
| --- | --- |
| Shared-image duration | 520ms |
| Source snapshot | 316.797 × 197.984px |
| Destination snapshot | 1296 × 810px |
| Image aspect ratio at both ends | 1.6, or 16:10 |
| Title settle | 220ms, translateY 12px to 0 with opacity .4 to 1 |

The same villa framing, embedded site title, and search strip persist during expansion. The intermediate image travels above the live destination for the brief transition. It does not leave a cursor snapshot at the source position. The timing is tunable through the project-entry/title CSS tokens; these measurements are not a performance score.

[Preview, project entry, and selected-work return recording](../.scratch/portfolio-halyard/demos/06-aurelia-shared-entry.webm)

Browser coverage includes immediate return during entry, source growth, unavailable/throwing/skipped transition APIs, reduced-motion changes, absent source imagery, direct visits, modified clicks, touch, Back/Forward, selected-work restoration, and responsive layout. Other browser engines and final Halyard typography remain part of release verification.
