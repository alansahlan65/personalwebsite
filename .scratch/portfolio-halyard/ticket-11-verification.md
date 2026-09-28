# Ticket 11 verification

Implemented in `b0715ab` from `c2161d9` and verified on 28 September 2026. Ticket status is `needs-info` for personal contribution and collaborators.

## Delivered

Gallery row 04 opens `/work/munchpal` locally with a source-PDF cover preview in the independent committed version. The integrated working gallery retains the already-present generated compact/expanded banner pair, with Munchpal linked locally. Pointer movement retargets the active preview across moving rows; keyboard focus takes precedence. Direct, shared-image, native new-tab, Back/Forward, and explicit return journeys preserve their destinations, focus, and saved gallery position.

The case study leads with the food-sharing problem, intended audience, confirmed client-project status, and three design decisions. The hero and four explanatory panels come from the actual PDF: research summary, user-flow map, homepage, and request/notification feedback. Desktop vertical scroll drives the four-panel progress and horizontal sequence; image links and Skip work with keyboard focus. Narrow, enlarged-text, reduced-motion, forced-color, and no-JavaScript views retain full stacked content and native links. The page links to the original PDF and embedded Figma prototype, then states implementation needs and evidence limits. A source-based static JPEG supplies the social preview.

## Sources and claim limits

The [13-page Munchpal PDF](https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view) returned HTTP 200 and was rendered page by page. Its SHA-256 is `1da12eb7deda7feefb5434f5aaa32ec7e68272ed6f02d518f19f34204a02d8e1`. The embedded [Figma prototype](https://www.figma.com/proto/Xsj8X9CcL5SW6CoILaZFH3/MunchPal?node-id=327-4477&t=I0tPWQMFFzQHCDff-1&scaling=scale-down&content-scaling=fixed&page-id=326%3A3405&starting-point-node-id=327%3A4467&show-proto-sidebar=1) opened in Chromium 153.0.8010.12 and displayed request, posting, donation, and community flow starting points. The PRD's Behance listing returned HTTP 403. The page relies on the PDF and prototype rather than that listing.

Alan confirmed this was a client project. His exact responsibilities and collaborators remain unanswered. The PDF's first-person process text does not by itself establish sole authorship. Garda Pangan appears in the designed bulk-donation route, without independent proof of a formal relationship. The PDF reports participant, completion, task-time, relative-efficiency, UEQ, and quote claims without task-level or questionnaire records; these are not presented as measured portfolio outcomes. No public service, pickup, donation transaction, or live food inventory was verified. [The source assessment](../../docs/munchpal-case-study.md) records page-by-page use, media crops, and provenance limits.

## Checks

| Check | Result |
| --- | --- |
| Final integrated Playwright suite | **156/156 Chromium tests passed**, 2.7 minutes, preview on port 3001 with port-3000 bridge for a pre-existing hard-coded test |
| Independent committed implementation | **14/14 Munchpal checks passed**, 10.1 seconds, production snapshot on port 3004 |
| TypeScript, ESLint, production build | Passed on the final committed snapshot; Munchpal and social image statically prerendered |
| Gallery | One active preview, rapid pointer retargeting, keyboard precedence, native modified click, shared-image entry, saved return |
| Media | Original images loaded; progress traversed 01→04 and reversed; image links, Skip, and focused controls remained reachable |
| Fallbacks | 320, 390, 768, 1440 px; 200% text; runtime preference/viewport changes; touch; reduced motion; forced colors; no JavaScript |
| Metadata and runtime | Source-based social JPEG returned HTTP 200; no page errors; mobile width 390 px without horizontal overflow |

The route and gallery destination each failed their focused red check before implementation. The first full integrated run found one hard-coded port-3000 test before its preview was available and an older PawFriend assertion that measured pre-click scroll while the moving gallery could change the actual click position. A port bridge and a click-time departure measurement fixed those fixtures; both checks passed three focused reruns. A later full run found Chromium sometimes suppressed the next synthetic click after a raw CDP `touchEnd` swipe. Trace and event logging showed `touchstart` and `touchend` reached the correct link but no `click` fired. Ending that injected test gesture with `touchCancel` kept the observed role scroll and made the subsequent tap reliable in ten consecutive runs; the final full suite then passed. No site behavior was changed for these two fixture corrections.

## Browser evidence

The [portfolio journey recording](demos/11-munchpal-case-study-journey.webm) shows committed gallery entry, original source imagery, four-panel progress and reversal, Skip, reduced-motion mobile reading, and return. [Gallery](demos/11-munchpal-gallery.png), [desktop introduction](demos/11-munchpal-desktop.png), [original cover](demos/11-munchpal-source-hero.png), [media](demos/11-munchpal-media.png), [implementation notes](demos/11-munchpal-notes.png), [mobile introduction](demos/11-munchpal-mobile.png), and [mobile media](demos/11-munchpal-mobile-media.png) screenshots were captured and inspected. [Measurements](demos/11-browser-evidence.json) show 4,032 px desktop media travel, progress states, 390 px mobile width, HTTP 200 social image, and zero page errors.

## Review and remaining scope

Separate standards and spec reviews of `c2161d9...b0715ab` found an inaccurate gallery-artwork label in the first implementation; it was removed. Both reviews leave one acceptance gap: the ticket asks for Alan's actual contribution and collaborators in the introduction, but these have not been confirmed. Standards review also noted minor pre-existing-style duplication in the gallery's slug-based image metadata and paired case-study CSS rules as judgment-only cleanup opportunities. No Next.js 16.3.6 convention breach or further ticket defect was found. The final test-only corrections were re-reviewed.

The work is committed on `master`; unrelated pre-existing refinements remain unstaged in the shared working tree. The site-wide `metadataBase` remains unset, so Next.js uses localhost for absolute social URLs in the preview. Chromium emulation does not establish physical-device, other-browser, or assistive-technology results.
