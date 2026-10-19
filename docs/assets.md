# Portfolio asset record

Reviewed 19 October 2026. JSON manifests and adjacent sidecars own exact paths, node IDs, dates, hashes, dimensions, prompts, and transformations. This record explains current use and source limits.

## Identity and font

| Asset | Source and delivery |
| --- | --- |
| AS mark | Supplied `assets/Alan Logo.png`; original blue shading retained in the local header/footer/favicon asset |
| About portrait | Supplied `assets/Personal Photo.jpeg`, auto-oriented and prepared as [alan-portrait.webp](../public/images/alan-portrait.webp); [sidecar](../public/images/alan-portrait.webp.json) records preparation |
| Home character | Generated transparent renders based on Alan's supplied photo; [character record](alan-character.md) and adjacent PNG sidecars preserve exact prompts/input roles |
| Plus Jakarta Sans | Variable WOFF2 in [app/fonts](../app/fonts/), loaded by `next/font/local`, weights 200–800; [SIL license](../app/fonts/OFL.txt) retained |
| Resume | [Current PDF](../public/resume/alan-sahlan-resume.pdf), with locally embedded regular/semibold font instances and verified professional facts |

The font source is [Google Fonts' Plus Jakarta Sans repository directory](https://github.com/google/fonts/tree/main/ofl/plusjakartasans). The WOFF2 was packaged from the variable source with FontTools. The unreferenced TTF was removed on 19 October; the loaded WOFF2 and license remain. No font CDN is required.

## Role icons and decorative covers

Supplied local Streamline gradient SVGs map feather to Product Designer, monitor to Design Engineer, and stars to Interaction Designer. Their paths/gradients remain intact. Alan confirmed permission to display them; retain the footer credit. The precise license tier was not independently verified.

Four expanded WebP covers under `public/images/work/` serve both gallery states. They are generated concept artwork. [The banner manifest](selected-work-banners.json) preserves prompts, source URLs, and generation records, including retired compact versions. Retired records do not mean those former files still ship. Covers establish no historical interface, outcome, inventory, or photography claim.

## Original project evidence

- Aurelia uses eleven complete original Figma SVG section/form exports. Its observed-flow WebM is a recording of the live concept. The source's stay photography is user-authorized generated imagery. See [the case record](aurelia-case-study.md).
- Paylecta uses original desktop/mobile SVG exports and a preserved high-resolution laptop hero. PDF-derived social imagery remains separate from current screen delivery. See [the case record](paylecta-case-study.md).
- Munchpal uses English SVG phone screens, native flow diagrams, and documented English Before-state adaptations. Original Indonesian research figures and records remain separate. See [English adaptations](munchpal-english-refresh.md).
- PawFriend uses four original 1440×900 live-concept screenshots and an observed-flow WebM. The source's pet imagery/profiles are generated/sample content. See [the case record](pawfriend-case-study.md).

[figma-project-assets.json](figma-project-assets.json) records exported evidence. [munchpal-english-assets.json](munchpal-english-assets.json) records English sources/adaptations. [project-preview-assets.json](project-preview-assets.json) maps optimized SVG display copies to originals. The SVG optimizer compresses embedded photographs at their existing dimensions and preserves vector UI. Full-image links open original exports. Conversion and enlargement recover no missing raster detail.

## Motion and social media

[The Aurelia browser package](../public/demos/aurelia/README.md) is the current 36-second header composition; its old MP4 is explicitly archival. [Paylecta](../public/demos/paylecta/README.md) and [Munchpal](../public/demos/munchpal/README.md) retain editable HTML, rendered MP4, posters, local libraries/fonts, licenses, and asset manifests. Manifests may deliberately preserve exports not loaded by the final composition. These are later portfolio studies.

The new [40-second MunchPal HyperFrames package](../public/demos/munchpal-opener/README.md) is a separate browser review composition. Its manifest preserves seven refreshed Figma exports from 19 October 2026, the original wordmark, decoded source photographs and licensed Rubik. It adds original articulated vector people for the user's revised opening. English motion-study adaptations and the illustrations are separate from source evidence. The existing website MP4 remains in place.

Static social images under `app/` use the supplied identity or original project evidence, with adjacent provenance and alternative text. The public origin remains a publication setting. Native observed-flow recordings use `preload="none"` and deliberate playback.

The original homepage composition image remains unavailable. Current layout is documented in [DESIGN.md](../DESIGN.md); no pixel match to that reference is asserted. Preserve original-format evidence, licenses, sidecars, and source manifests during cleanup.
