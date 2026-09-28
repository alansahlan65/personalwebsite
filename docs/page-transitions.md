# Page transitions

Home, About, and Aurelia use a persistent `NavigationTransition` in the root layout. Internal `TransitionLink` links keep Next.js prefetching and use its `onNavigate` callback to cover the screen before changing routes. The page curtain rotates the Menu's stairs onto the horizontal axis: five full-width cobalt bands enter from the left and exit through the right on forward navigation. Returning to Work or using Back enters from the right and exits through the left. The page switches while fully covered. The Menu retains its existing vertical motion.

Menu timing in `app/lib/stairs-motion.ts` follows the linked [Sliding Stairs Menu tutorial](https://blog.olivierlarose.com/tutorials/sliding-stairs-menu) and its [published animation source](https://github.com/olivierlarose/sliding-stairs-menu/blob/main/src/components/header/anim.js): 500ms entry, 300ms exit, 50ms stagger and cubic-bezier(.33, 1, .68, 1). Pages keep the tuned `PAGE_MOTION_DURATION_MS` of 610ms, with a 30ms stagger and a gentler `--page-transition-ease`, cubic-bezier(.65, 0, .35, 1). This is the published easeInOutCubic curve from [easings.net](https://github.com/ai/easings.net/blob/master/src/easings.yml). Panel durations are 231.25ms cover and 138.75ms reveal. Full waves take 351.25ms and 258.75ms; the backdrop fades to 50% opacity and back over those phase lengths without extending them. Route-loading time is separate. Menu timing stays unchanged.

The Web Animations API moves page bands from translateX(-100%) to translateX(0%) to translateX(100%) forward, and the opposite sequence back. Their vertical positions stay fixed. Forward staggers top to bottom; back reverses that stagger, producing the opposite staircase. Each band has sharp corners matching Menu and retains 16px overscan on both sides, preserving its travel distance and full coverage. The existing 1px overlap hides row seams. Only transforms and opacity animate.

Completion promises gate navigation, so slower playback and interrupted animations do not uncover a partially changed page. A newer click updates the destination or retargets the moving panels and backdrop from their current appearance. The internal destination is prefetched as covering starts, allowing route data to load during the wave. The fixed curtain covers exactly the viewport, independently of document height and scroll position. Optional CSS properties `--route-curtain-duration`, `--route-curtain-exit-duration` and `--route-curtain-stagger` allow slow playback during debugging; production panel defaults are derived from the total budget and shared Menu duration ratio.

When navigating from an open menu, the menu stays visible beneath the covering panels. Once the curtain is opaque, a before-navigation event closes the menu and releases its scroll lock before Next.js navigates. RouteFocus assigns destination focus and restores selected-work positions beneath the curtain. Same-page Contact and Work anchors retain native scrolling. Direct visits, reloads, and local interface updates do not play a route transition.

The project gallery keeps its native Next.js Link and `project-entry` transition type so Aurelia's shared-image expansion retains its existing behavior. Other links to Aurelia and explicit return links use the curtain. Browser Back/Forward covers the outgoing page before forwarding the original history state to Next's restoration handler. A position stored alongside Next's history state determines the direction: Back travels right to left and Forward travels left to right. This does not push or replace history entries during traversal. Same-page history changes remain native. General page transitions do not depend on React/browser snapshot support. `PageTransition` remains a plain content wrapper; the project image boundary still uses React ViewTransition for shared imagery.

## Access and fallbacks

- The curtain has no pointer events or accessible content. Links and buttons remain usable during the animation.
- Destination heading or section focus is assigned during the route commit.
- Touch uses the same curtain; shared-image spatial motion remains disabled on touch.
- Reduced motion uses an 80ms opacity transition per phase and disables spatial project effects. Changing the preference during motion finishes the active phase.
- Forced colors makes route changes immediate.
- Missing, failed, or skipped browser snapshot support does not disable the curtain.
- Modified clicks, downloads, and external destinations retain native behavior.

Browser checks live in `tests/page-transitions.spec.ts` and `tests/stairs-motion.spec.ts`, alongside the existing header/menu, project-entry and pointer regression checks. The Work-to-About-to-Work regression explicitly disables browser view transitions, and a slowed-animation check verifies that the route stays unchanged until every covering panel finishes. Sampled bounds confirm fixed vertical positions, gentle acceleration and deceleration, and complete viewport coverage. Native animation timings verify that both complete waves total 610ms. Back reverses cover and reveal.

## Header and menu

The top header shows direct navigation links. Menu appears only after scrolling past 96px; scrolling above 48px brings the links back. These separate thresholds prevent flicker near the boundary. The header keeps its layout space and remains sticky while its links fade and draw toward the right over 280ms. Menu enters with a short fade and an 8px settle. Keyboard focus keeps its control available until focus moves away; a pointer click on Work allows the header to collapse after its anchor scroll.

The menu retains five full-height vertical columns that slide down from above the viewport, then retract upward on close. Opening sequences left to right; closing reverses the stagger. Its timing and dimming backdrop remain unchanged by the horizontal page correction. Links and profiles settle with opacity and an 8px translation. Panel completion controls unmounting, including interrupted close/reopen actions. Reduced motion removes spatial movement and keeps the header's 80ms opacity transition. Scroll locking, Escape, focus trapping, and focus restoration remain active throughout the menu transition.

## Verification

The motion refinement passed all 53 browser checks across page/stairs, header/menu, project entry and pointer feedback. Samples at 390px and 1440px confirm horizontal movement in both phases, reversed Back direction, complete opaque coverage and no horizontal overflow. First and last 10% travel intervals cover less distance than their adjacent intervals, confirming soft starts and stops. Menu source files and shared timing constants have unchanged SHA-256 hashes. Typecheck, lint and production build passed. The subsequent corner adjustment restores sharp edges while preserving the approved motion, timing and overscan.
