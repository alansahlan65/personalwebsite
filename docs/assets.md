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

No generated imagery was used. Ticket 07 uses the CC0 photographs recorded below. User-supplied originals remain unchanged. The Aurelia derivative is a screenshot of the live concept, not a separately verified source photograph.

## Decorative role photographs

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

The user confirmed independent design/build authorship and approved live-site screenshots. Underlying stay-photography rights remain unverified and need confirmation before release. Original research notes, iteration history, and source-code details were unavailable; the case study uses observed interface evidence and does not claim those activities or results.

## Paylecta original design media, ticket 09

The hero and three media panels are full original pages 1, 4, 6, and 7 of the supplied Paylecta case-study PDF, rechecked on 27 September 2026. Shipping files are `paylecta-cover.webp`, `paylecta-overview.webp`, `paylecta-customers.webp`, and `paylecta-invoices.webp`, each 1402 × 1081. JSON sidecars record the source URL/hash, PDF page, original date, preparation, and evidence limits. These static original mockups are separate from any later generated gallery artwork. The scoped ticket commit uses the original cover as its gallery preview; the working gallery retains the previously approved generated pair. See [the Paylecta media record](paylecta-case-study.md#media-delivery-and-reading).
