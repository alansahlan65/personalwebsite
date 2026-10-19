# Quality and release checks

Reviewed 19 October 2026. This is the current validation record; older implementation reviews and their provisional blockers are superseded by the results below.

## Local commands and coverage

Run `npm run typecheck`, `npm run lint`, `npm run build`, and the Playwright checks relevant to a change. `npm test` uses [the Chromium configuration](../playwright.config.ts). The [manual About configuration](../playwright.about-engines.config.ts) is available for explicit Firefox/WebKit checks; its presence does not imply a recent cross-browser run.

The browser suite covers navigation, gallery entry/return, pointer controls, menu interruption, responsive layouts, enlarged text, touch emulation, themes, motion preferences, original media, contact recovery, and no-JavaScript reading. The project acceptance widths are 390, 768, and 1440px, with 320px overflow and intermediate-layout checks.

## Latest application verification

The revised 40-second MunchPal HyperFrames review composition passed its complete check on 19 October: zero errors or warnings in static lint, runtime, layout and contrast. Three informational occlusion reports describe source fields scrolling beneath the fixed report heading. Twenty-two editorial frames were reviewed, including the full logo opening, articulated illustrated people and 640px contact sheet. All four product-tour tap indicators hit their controls; seven reverse-seek samples and the final-to-first logo loop matched within one RGB code value. Rubik loaded locally, and reduced motion started paused at the logo poster with the debug controls hidden. The choreography map was reviewed for articulated arm and thumb motion, deliberate plane overlap, clipped scrolling, brief tap feedback and slow spotlight motion. List photograph fills were verified after rasterizing the preserved PNG/JPEG source before SVG WebP optimization. The website MP4 was not replaced. See [production notes](munchpal-opener.md).

The 19 October unused-code cleanup removed 19 files totaling 6,151,466 bytes and dead selectors, attributes, and custom properties. It skipped page-motion observers on pages without targets and prioritized the Aurelia poster. Those unused public files were not part of visitors' previous downloads.

Production builds, strict TypeScript unused-local/parameter checks, and repository lint passed. Lint retains two existing `no-unused-expressions` warnings in the Aurelia composition source `header.js` and archival `timeline.js` under `.scratch/aurelia-design-tour/`.

The full Chromium run executed 351 cases across 41 files: 348 passed and three failed. Two contrast checks sampled the trivia reveal before it settled; the test now waits for final opacity. One Munchpal large-image check hit its five-second timeout under parallel load. All three then passed twice in focused runs. Every distinct case has a passing result across the full run and follow-ups; a single all-pass full run was not recorded. The parallel-load timeout remains a known test stability limit.

All 28 phone/desktop, light/dark full-page comparisons were pixel-identical after the code cleanup, with unchanged dimensions, no broken images, no horizontal overflow, and no page errors. All 21 SVG display-preview entries passed file, byte-size, and XML checks. Demo manifest hashes and sizes passed. Standards and specification reviews found no actionable defects in that cleanup.

Raw evidence remains in [the cleanup directory](../.scratch/unused-cleanup/): [full results](../.scratch/unused-cleanup/full-results.json), [focused reruns](../.scratch/unused-cleanup/final-focused-results.json), [before](../.scratch/unused-cleanup/before.json), [after](../.scratch/unused-cleanup/after.json), and [removal inventory](../.scratch/unused-cleanup/removals-planned.json).

## Performance

The local production comparison used two fresh-browser samples per route, disabled cache, 4x CPU slowdown, 10 Mbps download, and 40ms simulated latency. These are lab measurements, not field scores.

| Route | Before median LCP | After median LCP |
| --- | --- | --- |
| Home | 0.578s | 0.702s |
| About | 0.718s | 0.618s |
| Contact | 0.574s | 0.512s |
| Aurelia | 1.706s | 1.214s |
| Munchpal | 0.836s | 0.732s |
| PawFriend | 0.520s | 0.578s |
| Paylecta | 0.576s | 0.546s |

The slowest after sample was 1.232s; maximum observed CLS was 0.01571. [The raw summary](../.scratch/unused-cleanup/performance-summary.json) retains sample details. Two samples cannot establish a statistically reliable improvement across every route.

Preserve local font delivery, reserved image dimensions, appropriate hero priority, responsive/lazy below-fold images, optimized SVG display copies, and deferred native recordings. Pointer work batches by animation frame; offscreen/hidden media and character tracking pause. Navigation prefetches while the page curtain covers.

## Remaining release work

- Choose the public portfolio origin, set `SITE_ORIGIN` during the build, and recheck absolute social URLs. Preview `noindex` remains until publication is intended.
- Recheck current professional facts and external destinations before publication; previous HTTP observations are dated evidence, not live availability guarantees. Freelance work's end date remains unconfirmed, so the resume states its start date only.
- Alan confirmed display permission for supplied imagery and role icons. Retain the Streamline credit; the exact license tier was not independently verified.
- A deliberately delayed route previously remained covered without meaningful loading/recovery feedback. Keyboard bypass is implemented; delayed-route feedback still needs a product decision and implementation.
- Physical-device and assistive-technology use, field performance, and a fresh full Firefox/WebKit run are not established by the Chromium evidence.
- Individual Munchpal revision effects and real-world project outcomes remain unmeasured. Paylecta's unsupported metrics and persona/testimonial claims remain excluded.

## Markdown maintenance

The current Markdown cleanup validates local links, fragments, referenced files, document ownership, retained main files, and stale terminology against the working tree. It changes documentation and graph metadata; it does not establish new application runtime or performance results. Its machine-readable inventory and checks live in [the cleanup directory](../.scratch/markdown-cleanup/).
