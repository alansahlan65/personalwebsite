# Portfolio asset record

Inspected 2026-09-24 for ticket 01. The user supplied the assets folder for this implementation.

| Asset | Source and preparation | Current use |
| --- | --- | --- |
| AS mark | Original `assets/Alan Logo.png`, 512 × 512 transparent PNG. Copied without visual changes; origin metadata embedded in the shipping PNG. | Header/home link, footer/home link, provisional favicon |
| Portrait | Original `assets/Personal Photo.jpeg`, 4032 × 3024 with EXIF orientation 6. Auto-oriented to portrait, resized to 1600 × 2133 and WebP-encoded at quality 85, about 646 KB. Original preserved. | Inset hero image; CSS crops the displayed frame |
| Portrait provenance | `public/images/alan-portrait.webp.json` stores the origin because the provenance tool uses a sidecar for WebP. | Source attribution for the optimized derivative |
| Aurelia interface | Screenshot of the [live Aurelia concept](https://aurelia.alansahlanwork.workers.dev/) captured 2026-09-25 with a 1440 × 900 viewport. The user explicitly approved this screenshot for the gallery and case-study hero. Encoded as 1440 × 900 WebP at quality 82, 85.5 KB. `public/images/aurelia-interface.webp.json` records its origin. | Gallery inline preview and case-study hero |

The original photo and mark were visually inspected. The portrait contains Alan in a dark shirt against an architectural background. The supplied mark is preserved, including its blue shading; it is not recolored to the UI accent.

## Missing inputs

- Halyard Display Variable font files or an authorized Adobe Fonts web-project stylesheet. CSS currently attempts local Halyard, then uses the approved neutral loading/development fallback. This is not delivered web typography and does not satisfy the font acceptance criterion.
- The approved homepage composition image referred to in the PRD. The implementation follows the written split composition; pixel fidelity to the unavailable image has not been verified.
- Remaining project media belongs to later tickets. Ticket 07 supplies the decorative landscape capsules below. Ticket 02 verified email/profile destinations and inspected the source resume; a current release resume remains pending. See [content sources](portfolio-content.md).

The homepage labels its development state. Aurelia is an interactive gallery link; the other project rows remain static until their case studies exist. Resume is visibly unavailable. About now opens /about, and contact opens an email draft to the user-confirmed address.

Before the selected-work banner update of 27 September 2026, no generated imagery was used. That update adds the eight concept artworks recorded at the end of this document. Ticket 07 uses the CC0 photographs recorded below. User-supplied originals remain unchanged. The Aurelia derivative is a screenshot of the live concept, not a separately verified source photograph.

## Decorative role photographs

Replaced on 27 September 2026 by the user-supplied SVG role icons recorded below. This section retains their original provenance.

Verified and prepared 2026-09-26. Each creator published their own photograph under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). The source pages record that permission. These images make no claim about Alan's location or project involvement.

| Shipping file | Photograph and creator | Preparation |
| --- | --- | --- |
| `role-ocean.webp` | [Still and clear sea](https://commons.wikimedia.org/wiki/File:Still_and_clear_sea.jpg), Jdszekeres, 5 April 2024 | 800 × 360, WebP quality 82, 54,882 bytes |
| `role-mountain.webp` | [Goell Kellau](https://commons.wikimedia.org/wiki/File:Goell_Kellau.JPG), Enschiner, 10 May 2008 | 800 × 360, WebP quality 82, 52,970 bytes |
| `role-coast.webp` | [Beach Scene](https://commons.wikimedia.org/wiki/File:Beach_Scene.jpg), Tammcd7, 16 June 2013 | 800 × 360, WebP quality 82, 65,128 bytes |

All three crops were visually inspected. They retain the source colors and use a centered landscape crop. Their adjacent `.webp.json` records preserve original URLs, creators, license URLs, verification date, and preparation. Empty alt text hides the images from assistive technology; decorative repeated units also have `aria-hidden`. Halyard web-font delivery remains pending.

## Aurelia workflow evidence (ticket 08)

Captured from the live concept on 26 September 2026 at 1440 × 900. Images were inspected after the source photographs loaded; screenshots were encoded to WebP quality 82 without synthetic edits.

| Shipping file | Observed state | Size |
| --- | --- | --- |
| `aurelia-filters.webp` | Work and stay longer / Uluwatu empty result and recovery action | 41,502 bytes |
| `aurelia-details.webp` | Awan Cliff House, Wi-Fi tab and loaded stay photograph | 83,830 bytes |
| `aurelia-request.webp` | Initial Dates step with summary and unconfirmed-request notice | 37,254 bytes |
| `aurelia-observed-flow.webm` | Silent recording: empty filters/reset, details/tab/close, Dates/Stay/Back/close | 2,344,899 bytes |

Adjacent JSON sidecars record source, date, viewport, preparation, and evidence limits. Images use intrinsic dimensions and responsive Next.js delivery; the native video uses `preload="none"`, a poster, and user-controlled playback. Sample dates in the recording do not represent availability. No request was submitted.

The user confirmed independent design/build authorship and approved live-site screenshots. On 28 September 2026 he confirmed permission to show the underlying stay imagery and described it as AI-generated. Original research notes, iteration history, and source-code details were unavailable; the case study uses observed interface evidence and does not claim those activities or results.


## Typography update, 27 September 2026

The user replaced Halyard with Plus Jakarta Sans. The variable TTF was obtained from https://github.com/google/fonts/tree/main/ofl/plusjakartasans and losslessly packaged as WOFF2 through FontTools. app/fonts/OFL.txt retains the SIL Open Font License. next/font/local delivers it from the site with no browser font-CDN dependency. Regular and semibold static instances are embedded in the local resume. This supersedes the missing-Halyard input above; historical records retain the original requirement.

## Role icons, 27 September 2026

The user supplied the complete Streamline Plump Gradient SVGs and explicitly assigned Feather Pen to Product Designer, Code Monitor 2 to Design Engineer, and Multiple Stars to Interaction Designer. The correction supersedes the earlier duplicated monitor assignment and the proposed free duotone trio.

| Shipping file | Role | Supplied gradient |
| --- | --- | --- |
| `role-feather.svg` | Product Designer | #00d078 to #007df0 |
| `role-monitor.svg` | Design Engineer | #ff51e3 to #1b4dff |
| `role-stars.svg` | Interaction Designer | #00d078 to #007df0 |

The supplied paths, 48x48 viewBoxes, descriptions, and gradients are preserved. Whitespace and empty-tag formatting are normalized. Icons are locally served SVG images, displayed square with contain sizing and decorative empty alternatives beside the role labels. Separate SVG documents isolate their gradient identifiers across repeated track copies. No icon library, external image requests, or new animation dependency is added.

The shared footer credits Streamline with a direct link. Its attribution guidance is documented at https://help.streamlinehq.com/en/articles/5354376-streamline-free-license. The source of these exact files is the user's message. On 28 September 2026 he confirmed permission to show the supplied icons, describing the assets as AI-generated; the precise Streamline license tier or purchase was not independently verified.

Verification: production build and ESLint passed; the source detector returned no findings. All 20 existing homepage and role-track tests passed, with one reduced-motion resize check passing on targeted rerun after an initial timing failure. Desktop/mobile screenshots showed crisp transparent icons at 112px/48px, no page overflow, and no page errors. Existing tests covered intermediate widths, text resizing, scroll reversal, touch navigation, and menu/project interaction.

## Selected-work banners, 27 September 2026

Eight distinct artworks were generated with OpenAI's built-in Image Gen for the homepage gallery, one compact and one expanded composition per project. Each pair keeps the inspected project identity while changing its scene or layout. The user supplied the project sources and delegated the banner compositions. These images are decorative concept artwork. Generated interface details, scene photography and sample values are separate from original project evidence and establish no project outcomes.

| Project | Inspected source | Shipping files under `public/images/work/` |
| --- | --- | --- |
| Aurelia | [Live hospitality concept](https://aurelia.alansahlanwork.workers.dev/) | `aurelia-compact.webp`, `aurelia-expanded.webp` |
| Paylecta | [Supplied finance case-study PDF](https://drive.google.com/file/d/19UDppHbm1QU3C_0gCycbTltVKUSxPxmi/view) | `paylecta-compact.webp`, `paylecta-expanded.webp` |
| PawFriend | [Live pet-adoption project](https://pawfriend-topaz.vercel.app/) | `pawfriend-compact.webp`, `pawfriend-expanded.webp` |
| Munchpal | [Supplied food-sharing case-study PDF](https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view) | `munchpal-compact.webp`, `munchpal-expanded.webp` |

[The generation manifest](selected-work-banners.json) preserves exact prompts, source URLs, original generator output paths and shipping paths. Each WebP has an adjacent `.webp.json` containing its exact generation prompt and timestamp. The prepared sources use WebP quality 88; responsive Next.js delivery supplies the displayed derivatives. Compact desktop frames crop to 4.2:1, expanded desktop frames to 3:1, intermediate expanded frames to 2.75:1 and mobile frames to 3:1. This display cropping does not change the preserved prompts or original generator outputs.

Implementation checks confirmed all eight artworks have unique hashes and load, and the metadata scan reported eight raster files with zero missing provenance. The [scoped implementation record](selected-work.md) records navigation, motion, reference adaptations and verification limits. Historical screenshot and photograph records above remain intact.

## Paylecta original design media, ticket 09

The hero and three media panels are full original pages 1, 4, 6, and 7 of the supplied Paylecta case-study PDF, rechecked on 27 September 2026. Shipping files are `paylecta-cover.webp`, `paylecta-overview.webp`, `paylecta-customers.webp`, and `paylecta-invoices.webp`, each 1402 × 1081. JSON sidecars record the source URL/hash, PDF page, original date, preparation, and evidence limits. These static original mockups are separate from any later generated gallery artwork. The scoped ticket commit uses the original cover as its gallery preview; the working gallery retains the previously approved generated pair. See [the Paylecta media record](paylecta-case-study.md#media-delivery-and-reading).

## PawFriend live concept media, ticket 10

The supplied live PawFriend site was inspected on 27 September 2026. Four authentic 1440 × 900 viewport screenshots provide `pawfriend-interface.webp`, `pawfriend-catalog.webp`, `pawfriend-shortlist.webp`, and `pawfriend-prepare.webp`, encoded at WebP quality 85 without cropping or synthetic edits. The native recording at `public/media/pawfriend-observed-flow.webm` shows browsing, local favorites, preparation, reload persistence, and removal. Source/hash/date/state sidecars and the static source-based social JPEG record provenance. These media are separate from generated gallery concept artwork. Original repository manifests document generated hero/resident imagery and sample profiles; they establish no real animal or shelter identity. See [the PawFriend media and claim record](pawfriend-case-study.md).

## Munchpal original case-study media, ticket 11

The supplied 13-page Munchpal PDF was visually inspected on 28 September 2026. Original pages and page-12 interface sections supply `munchpal-cover.webp`, `munchpal-research.webp`, `munchpal-flow.webp`, `munchpal-home.webp`, and `munchpal-feedback.webp`, encoded at WebP quality 88. A source-based JPEG supplies the social preview. Each media sidecar records PDF hash, page, crop, dimensions, preparation, and limits. The PDF's embedded Figma prototype link was opened in Chromium. These original design assets are separate from generated gallery concept artwork. Reported testing percentages and timings are omitted without underlying result records. See [the Munchpal source assessment](munchpal-case-study.md).

## Site share cards, ticket 12

The site card at `app/opengraph-image.jpg` combines Alan's supplied portrait and original AS mark with his confirmed Product Designer identity. The Aurelia card at `app/work/aurelia/opengraph-image.jpg` is a top-aligned crop of the inspected live-concept homepage, keeping its own brand and heading visible. Both are 1200 × 630 static JPEGs, with descriptive alt files and adjacent JSON records of sources, preparation, date, bytes, and SHA-256. The reproducible rendering script is `.scratch/portfolio-halyard/generate-ticket-12-social.py`. Paylecta, PawFriend, and Munchpal retain their existing source-based social images. The public portfolio domain is undecided, so absolute social URLs remain a deployment setting; preview metadata currently resolves against localhost.
