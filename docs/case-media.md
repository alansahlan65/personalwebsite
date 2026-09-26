# Case-study media reading

Ticket 08 completes Aurelia with its verified problem, independent contribution, two design decisions, three workflow panels, and normal vertical implementation notes/recording. The reusable `CaseMediaSequence` accepts panel text, authentic image paths/alt text, a section title/id, and a skip destination/label. The route keeps historical claims within available evidence.

## Scroll and focus

The initial HTML/CSS is a readable stack. Desktop enhancement requires width ≥ 1000 px, height ≥ 750 px, no reduced-motion preference, and panel content fitting the available height. The section uses native vertical scrolling and a CSS sticky frame. Its height is one viewport plus measured horizontal travel. Motion `scrollInfo` maps `start start` / `end end` progress directly to the track's single `translate3d` value. There is no smoothing, snapping, wheel interception, GSAP, or second transform owner.

The toolbar shows a semantic progress element and native skip anchor. Each panel includes brief workflow/decision text and an accessible screenshot link. Keyboard focus scrolls the document to expose the focused panel; Shift+Tab reverses the same mapping. The skip moves focus to the implementation heading after the section. Longer text and the native recording remain in ordinary vertical flow.

ResizeObserver, viewport resize, image load, and font readiness remeasure travel and fit. Runtime preference/size changes preserve the focused panel or current reading panel. Narrow, short, enlarged-text, reduced-motion, and no-JavaScript views retain the same text/media as a stack. CSS removes transforms immediately when reduced motion changes. Cleanup removes all listeners, observers, animation-frame work, and the scroll subscription on route exit.

An integrated Back-navigation check exposed a route-focus race: a pending entry effect consumed a later history event. Route focus now records the history destination pathname and ignores a stale route commit, preserving Selected work focus even when Back is pressed immediately during entry.

## Evidence and delivery

The [asset record](assets.md) and [content sources](portfolio-content.md) document live-source checks, screenshot preparation, sole authorship, and the silent recording. Image dimensions reserve layout space; responsive images load lazily. The video uses `preload="none"` to defer eager media loading and has native controls, a poster, a descriptive text account, and a direct-file fallback. No request was submitted to the source site.

Underlying photography rights remain a release dependency. Original research notes and implementation history are unavailable, so the case study makes no historical research, architecture, or outcome claims. Halyard web-font delivery remains pending; local visual checks use the existing neutral fallback.

## Verification

Browser coverage includes direct/reversed/stopped scroll and progress, complete keyboard reachability, native skip focus, 320–1440 px widths, runtime preference changes, delayed image loading, resize with focus preserved, 200% text, short viewports, actual touch scrolling, no JavaScript, route cleanup/return, screenshot opening, and native video playback. Existing pointer inventory and project-entry/history coverage remain applicable.

Typecheck, lint, and production build pass. The final full Chromium suite passed 94/94 against the corrected production preview, including 16 new media tests. The immediate history check and delayed-image check each passed three repetitions during diagnosis. Both independent reviewers confirmed their corrections; no findings remain.

## Local recording and measurements

[Integrated reading-flow recording](../.scratch/portfolio-halyard/demos/08-aurelia-horizontal-media.webm) covers shared entry, scroll/progress/reversal, keyboard panel focus, skip focus, toolbar-focus resize, reduced motion, mobile stacking, and return to Selected work. Desktop, middle-panel, mobile, and reduced-motion screenshots are adjacent.

Captured 26 September 2026 in headless Chromium on Windows against the production Next.js preview at 1440 × 900, with loaded media, neutral fallback font, and no CPU/network throttling. The measured section has 2,688 px of travel. A 30-frame scroll through its first half moved the track -1,345.00 px; after a 350 ms pause the drift was 0 px. The 29 sampled intervals had a 16.7 ms median and 16.7 ms maximum. The observer recorded no long tasks, the document width remained 1440 px, and the journey reported no page errors. This is one local sample, not a cross-device performance claim. Exact values are in [the measurement record](../.scratch/portfolio-halyard/demos/08-scroll-measurements.json).

Writing verification: all case-study copy and action labels were inspected against the surrounding voice and observed destinations. New route copy uses the existing “catalog” spelling. No actionable writing findings remain; Approve.

## Review corrections

Standards: no documented-standard breaches; one optional duplicated panel-to-scroll mapping. The shared helper now serves keyboard focus and resize preservation.

Spec: one confirmed bug moved the focused toolbar skip offscreen when switching to a stack. A browser test reproduced it before the fix. Measurement now preserves any focused sequence control, including the toolbar, before choosing a reading-panel anchor. The test covers resize and both runtime motion changes; it passes. The delayed-image fixture now waits for enhancement while the source remains blocked, avoiding a comparison between different layouts, and passed three repetitions. No further spec gap or scope creep was reported. Independent follow-up confirmed toolbar focus remained visible during resize and both preference changes, and Enter still focused the implementation heading.
