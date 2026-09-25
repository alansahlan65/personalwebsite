# Homepage asset record

Inspected 2026-09-24 for ticket 01. The user supplied the assets folder for this implementation.

| Asset | Source and preparation | Current use |
| --- | --- | --- |
| AS mark | Original `assets/Alan Logo.png`, 512 × 512 transparent PNG. Copied without visual changes; origin metadata embedded in the shipping PNG. | Header/home link, footer/home link, provisional favicon |
| Portrait | Original `assets/Personal Photo.jpeg`, 4032 × 3024 with EXIF orientation 6. Auto-oriented to portrait, resized to 1600 × 2133 and WebP-encoded at quality 85, about 646 KB. Original preserved. | Inset hero image; CSS crops the displayed frame |
| Portrait provenance | `public/images/alan-portrait.webp.json` stores the origin because the provenance tool uses a sidecar for WebP. | Source attribution for the optimized derivative |

The original photo and mark were visually inspected. The portrait contains Alan in a dark shirt against an architectural background. The supplied mark is preserved, including its blue shading; it is not recolored to the UI accent.

## Missing inputs

- Halyard Display Variable font files or an authorized Adobe Fonts web-project stylesheet. CSS currently attempts local Halyard, then uses the approved neutral loading/development fallback. This is not delivered web typography and does not satisfy the font acceptance criterion.
- The approved homepage composition image referred to in the PRD. The implementation follows the written split composition; pixel fidelity to the unavailable image has not been verified.
- Project crops/recordings and rights-cleared landscape capsules belong to later tickets. Ticket 02 verified email/profile destinations and inspected the source resume; a current release resume remains pending. See [content sources](portfolio-content.md).

The homepage labels its development state. Project rows remain static until their case studies exist. Resume is visibly unavailable. About now opens /about, and contact opens an email draft to the user-confirmed address.

No stock or generated imagery was used. User-supplied originals remain unchanged.
