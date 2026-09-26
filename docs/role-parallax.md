# Role parallax and integrated journey

Ticket 07 adds I-01 immediately after the hero. The section keeps the Design / Build / Refine label and three role tracks. Typography inherits the site's Halyard stack. Halyard web delivery is still missing; the screenshots and measurements use the neutral fallback.

## Scroll mapping

Motion's `scrollInfo` maps section progress from `start end` to `end start`. Each row uses the same progress with alternating direction. Travel is 32% of viewport width, capped at 460 px and by the space available around a complete role label. Each row reserves 24 px on either side of that label. Staggered offsets use 12%, 42%, and 26% of the remaining space. The second repeated label stays fully inside the viewport throughout the scroll range. Text that cannot fit uses a stationary wrapping row. Transforms are direct linear mappings, with no spring, time-based animation, or snapping.

A ResizeObserver measures the visible frame and first repeated unit. The number of copies covers the viewport, travel, and two extra units. A constrained grid column and local `overflow: clip` keep the repeated content from increasing document width. Section size changes and font readiness reconnect the scroll measurement at the current position. Observers and subscriptions are removed on unmount.

Each role has one semantic paragraph. Hidden sizing labels and repeated phrases have `aria-hidden`; photographs have empty alt text. No new focus stops, pointer handlers, wheel handlers, or touch handlers are attached to this section.

Reduced motion uses CSS from the initial render: no transform, one wrapping unit per row, and stationary images. Changes to the preference stop or reconnect the Motion subscription. Enlarged text can wrap without hiding the complete semantic label.

## Verification

Browser tests cover slow and large scroll steps, reversal, stopped positions, viewport resize, a loaded font with different metrics, actual browser touch events, reduced motion at load and after preference changes, and 200% text. Widths are 320, 390, 650, 768, 1000, and 1440 px. Every track covers both ends of its travel, and at least one complete role label fits at each sampled position. The document stays within the viewport. Accessible snapshots expose each role once.

The combined journey checks decorative-photo cursor inversion, compact header menu precedence, Work destination focus, keyboard gallery ownership while the pointer visits another row, Aurelia entry, and return to the saved page position. The existing gallery, cursor, header, and native shared-image entry remain covered by their browser tests.

## Local measurements

Captured 2026-09-26 in headless Chromium on Windows, production Next.js preview, 1440 × 900 viewport, loaded images and fallback font, no CPU or network throttling. A 30-frame scripted scroll advanced 240 px. The first and third tracks moved -70.91 px; the second moved +70.91 px. After a 350 ms pause, measured horizontal drift was 0 px for every track. The 29 sampled frame intervals had a 16.7 ms median and maximum. The PerformanceObserver reported no long tasks during that sample. This is one local sample, not a cross-device performance guarantee. Exact values are in [the measurement record](../.scratch/portfolio-halyard/demos/07-scroll-measurements.json).

## Recording and assets

[Integrated journey recording](../.scratch/portfolio-halyard/demos/07-roles-integrated-journey.webm) includes downward travel, stopping, reversal, the menu, keyboard project entry and return, resize to mobile, and reduced motion. Desktop, mobile, and reduced-motion screenshots are in the same directory.

The three CC0 photographs and their creators are recorded in [the asset record](assets.md). Missing inputs remain Halyard font delivery, the approved homepage comparison image, remaining project media, and the current release resume. These limitations are visible in the existing development notes and asset record.
