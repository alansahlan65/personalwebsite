# Ticket 09 verification

Implemented from `0e5ef6b30adf94995d42368823bb30b2aa5b6526`. Verified 27 September 2026.

## Delivered

Gallery row 02 opens `/work/paylecta` with shared-image entry, native modified clicks, saved return position, and destination focus. The integrated gallery retains the existing generated compact and expanded artwork. The independent committed gallery uses the original PDF cover. The page distinguishes later concept artwork from original project evidence.

The case study describes a client design project by Alan as sole UI/UX designer, with no collaborators, following his confirmation "myself, client." Problem, audience, contribution, and design decisions precede three panels about the overview, customers, and invoice/payment states. Desktop native scrolling drives progress and horizontal travel; image links and Skip remain keyboard-reachable. Narrow, short, enlarged-text, reduced-motion, forced-color, and no-JavaScript views preserve the reading journey. Implementation considerations describe requirements for a future build, without claiming historical development or release.

The [original PDF](https://drive.google.com/file/d/19UDppHbm1QU3C_0gCycbTltVKUSxPxmi/view) was fetched again with HTTP 200; all ten pages were rendered and inspected. Hero/media images and social preview use full original pages with provenance sidecars. Unsubstantiated outcome metrics, persona identity, photograph, and testimonial claims are omitted. Behance returned HTTP 403; no original live product or executable prototype was supplied or linked in the PDF. See [source assessment](../../docs/paylecta-case-study.md).

## Checks

| Check | Result |
| --- | --- |
| Final integrated Playwright suite | **129/129 Chromium tests passed**, 1.5 minutes, production preview on port 3003 |
| Independent committed snapshot | **12/12 Paylecta acceptance tests passed**, 9.0 seconds, production preview on port 3004 |
| TypeScript | Passed |
| ESLint | Passed |
| Production builds | Integrated tree and independent committed snapshot passed; Paylecta and its social image are statically prerendered |
| Gallery | One active row, focus precedence, rapid cross-row retargeting, one project keyboard stop, loaded artwork, shared-image entry, touch one-tap entry |
| Navigation | Direct/new-tab visits, native image tabs, Back/Forward, saved selection/scroll, explicit return, destination focus |
| Media | All original images load; progress advances and reverses; movement stops without drift; keyboard image reachability; Skip focuses subsequent notes |
| Reading fallbacks | 320, 390, 768, and 1440 px; enlarged text; runtime resize and motion preferences; forced colors; no JavaScript |
| Metadata | Consistent title/description, source-based social image returns HTTP 200, exactly one social-image alt description |
| Browser recording | Chromium 153.0.8010.12; no page errors; mobile document width 390 px; desktop travel 2688 px |

The first full run passed 127/129. Two older integration fixtures assumed Aurelia was the first gallery keyboard stop and tapped while a synthetic touch fling continued. The fixtures now verify the existing optional View all work stop and settle the fling before tapping the intended project. Both focused corrections passed, then the entire suite passed. Production code did not change for these corrections.

The direct-entry test failed before the route existed; the entry/return checks failed before gallery integration. Shared-image coverage exposed an offscreen destination hero, corrected by placing it before the facts. An independent Windows checkout exposed duplicate social alt metadata caused by a trailing newline; normalizing the text fixed it and the test verifies one description.

## Browser evidence

The [silent reading-journey recording](demos/09-paylecta-case-study-journey.webm) demonstrates this portfolio's gallery entry, original static mockups, progress/reversal, Skip, reduced motion, mobile reading, and return. It is a recording of the new portfolio reading experience, not original live Paylecta software or a reconstruction of historical behavior.

[Desktop](demos/09-paylecta-desktop.png), [gallery](demos/09-paylecta-gallery.png), [source hero](demos/09-paylecta-source-hero.png), [media](demos/09-paylecta-media.png), [implementation notes](demos/09-paylecta-notes.png), [reduced motion](demos/09-paylecta-reduced.png), and [mobile](demos/09-paylecta-mobile.png) screenshots were inspected. [Measurements](demos/09-browser-evidence.json) record the sequence's states, stopped transform, browser version, dimensions, errors, and social-image response.

## Review and scope

Independent Standards and Spec reviews found one duplicate CSS rule, a provenance description that did not cover both gallery versions, and a missing social preview. All were corrected; follow-up reviews found no remaining findings. The final integration-fixture review found no standards problems or weakened coverage.

Ticket changes are committed on `master`. Existing uncommitted site refinements remain in the working tree. The committed implementation was exported to an independent snapshot and built/tested without those refinements. Browser evidence records the integrated working version. The snapshot on port 3004 is temporary; the final preview on port 3003 remains available.

The production domain remains a site-wide release setting: Next.js currently defaults social-image absolute URLs to localhost because `metadataBase` is unset. Browser coverage uses Chromium emulation; it does not establish physical-device, Safari, Firefox, or assistive-technology results.
