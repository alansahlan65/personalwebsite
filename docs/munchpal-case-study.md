# Munchpal case study source assessment

Ticket 11 adds `/work/munchpal` and connects gallery row 04 to it. The portfolio keeps the existing generated compact/expanded banner pair in the integrated gallery. The independent committed gallery uses original PDF cover media. The generated banner is concept artwork, separate from the source designs.

## Sources and status

The [supplied Munchpal PDF](https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view) was downloaded with HTTP 200 on 28 September 2026. SHA-256: `1da12eb7deda7feefb5434f5aaa32ec7e68272ed6f02d518f19f34204a02d8e1`. All 13 pages were rendered and inspected, including the long wireframe and interface spreads on pages 11 and 12. The original PDF is preserved in ignored runtime storage.

The PDF's page 13 links to an [interactive MunchPal Figma prototype](https://www.figma.com/proto/Xsj8X9CcL5SW6CoILaZFH3/MunchPal?node-id=327-4477&t=I0tPWQMFFzQHCDff-1&scaling=scale-down&content-scaling=fixed&page-id=326%3A3405&starting-point-node-id=327%3A4467&show-proto-sidebar=1). Chromium 153.0.8010.12 loaded it with HTTP 200 and exposed named onboarding, request, posting, bulk-donation, and community flows. Selecting their starting points displayed the original screens without page errors. Clicking the visible request control did not establish a completed request or transaction, so the portfolio describes designed states rather than a working service. The PRD's [Behance listing](https://www.behance.net/gallery/227166295/Food-Sharing-Mobile-App-Munchpal-UIUX-Case-Study) returned HTTP 403 in Chromium and could not be used as a separate source.

Alan confirmed this was a client project. On 28 September 2026 he also confirmed that he designed the full flow, conducted research and interviews with Garda Pangan, made the information architecture, user flows, wireframes, and UI, and ran usability testing. He confirmed no other design collaborators; other people participated in interviews and usability testing. The page credits those specific contributions. Interviews do not establish a formal Garda Pangan partnership or a deployed integration.

## Claim limits

| PDF material | Supported use | Boundary |
| --- | --- | --- |
| Pages 1–3 | Food-sharing design problem, intended audience, project composition | A prototype/design record, not proof of a shipped service |
| Page 4 | Presentation of access and trust concerns | Alan confirms research and Garda Pangan interviews; the PDF's count of 15 people and underlying responses were not independently checked |
| Pages 5–10 | Persona, empathy, journey, flow, and information-architecture artifacts | Illustrative design documents, not independently verified research findings |
| Page 11 | Wireframes and visual-system choices | Original design process shown in the PDF |
| Page 12 | Homepage, request, notification, posting, bulk-donation, and community mockups | Designed screens and confirmation states, not live inventory, pickups, or organizational integration |
| Page 13 | A reported evaluation and prototype link | No task-level Maze export, participant results, timings, UEQ responses, calculation, or consent/source record was supplied |

Page 13 reports 20 participants, 99.16% completion, 0.084 tasks/second, 96.01% relative efficiency, roughly 12 seconds per task, an "Excellent" UEQ characterization, and unattributed feedback quotes. Alan confirms conducting usability testing, but no supporting dataset or method detail was supplied to reproduce these figures. The portfolio does not present them as measured outcomes. The PDF's Garda Pangan-branded route is a design reference, and the confirmed interviews do not establish a formal partnership. No claimed food availability or public deployment is verified.

## Original media

Five images were rendered from source PDF pages at 75% scale and encoded as WebP quality 88. They retain original typography, diagrams, phone mockups, and wording. Page 12 supplies source-page crops so the interface can be read at the size of a media panel; the rest use complete pages. Sidecars include the PDF hash, source URL, page, precise crop rectangle, image dimensions, date, and evidence limit. The social JPEG comes from the full original cover and its alt file has no trailing newline.

| Public asset | PDF page and clip in points | Dimensions | Bytes |
| --- | --- | --- | --- |
| `munchpal-cover.webp` | 1, full page | 1440 × 810 | 58,084 |
| `munchpal-research.webp` | 4, full page | 1440 × 810 | 56,228 |
| `munchpal-flow.webp` | 9, full page | 1440 × 810 | 38,050 |
| `munchpal-home.webp` | 12, x 0–1920, y 2750–3830 | 1440 × 811 | 40,346 |
| `munchpal-feedback.webp` | 12, x 0–1920, y 3700–4780 | 1440 × 810 | 50,430 |

## Reading and verification

The hero preloads the full cover. Four source panels follow the shared desktop vertical-scroll sequence with progress, image links, and Skip. The problem, audience, status, and observable design decisions precede them. Normal vertical flow holds implementation and evidence notes. Stacked content remains complete under narrow width, short height, reduced motion, and no JavaScript. The prototype and PDF are native external links with descriptive labels. No later reconstructed demo was needed.

The running website is the agreed test boundary. The direct route and gallery destination initially failed before implementation. Final browser coverage, source-image readiness, metadata, code review, and remaining attribution input are recorded in ticket 11 verification. The site-wide production domain remains unset, so `metadataBase` uses Next.js's localhost fallback for absolute social URLs. Browser emulation does not establish physical-device or other-browser results.
