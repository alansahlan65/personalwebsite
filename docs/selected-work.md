# Selected-work implementation record

Recorded 27 September 2026 from `app/components/project-gallery.tsx`, the selected-work rules in `app/globals.css`, and the section header in `app/page.tsx`. Scope is the homepage Selected work section. The supplied reference controls its layout; the surrounding warm canvas, charcoal, cobalt and locally bundled Plus Jakarta Sans remain the established identity.

## Layout and interaction

Four ruled rows retain Aurelia / Hospitality, Paylecta / Finance, PawFriend / Pet adoption and Munchpal / Food sharing. Each full row is a native link. On desktop the cobalt index aligns with the first heading line, category sits below the name, a 4.2:1 compact banner sits at right, and a 44px outlined arrow centers beside the copy. Banner corners are 12px.

Fine-pointer hover or visible keyboard focus activates one row. Keyboard focus wins over pointer hover. The active row puts a different, related artwork beneath its title across the title-to-arrow columns, at 3:1. Layout transitions take 500ms with cubic-bezier(.23, 1, .32, 1); artwork opacity takes 180ms. Reduced motion makes layout immediate and uses an 80ms image fade. Links remain usable during animation.

At 701px through 900px, header and row spacing tighten and expanded artwork uses 2.75:1. At 700px and below, compact banners remain visible below the copy at 3:1, with 10px corners and .875rem category text. Touch follows the destination with one tap. Compact banners use responsive Next.js lazy loading. An expanded variant is requested when its row becomes active; the compact image stays visible until the new image loads, then remains cached in that row. Both use `fill`, cover cropping and empty alternatives because the generated scenes are decorative.

Desktop project titles use `clamp(1.65rem, 4.2vw, 2.75rem)`, weight 650, tracking -.03em and line-height 1.15, tightened to 1.1 at 701px through 900px. At 650px and below, titles use `clamp(1.5rem, 6vw, 2rem)` with -.02em tracking and indices use .875rem. The section label is 1rem at weight 600. View all work is .6875rem at weight 600 with .04em tracking. These reference-specific choices and banner geometry are local section rules, not additions to the global type or shape system.

## Destinations and assets

| Row | Destination | Artwork pair |
| --- | --- | --- |
| Aurelia | `/work/aurelia` | `aurelia-compact.webp`, `aurelia-expanded.webp` |
| Paylecta | `/work/paylecta` | `paylecta-compact.webp`, `paylecta-expanded.webp` |
| PawFriend | `/work/pawfriend` | `pawfriend-compact.webp`, `pawfriend-expanded.webp` |
| Munchpal | `/work/munchpal` | `munchpal-compact.webp`, `munchpal-expanded.webp` |

All four rows now open local case studies with shared-image entry and return-history behavior. Their source PDF, live site, prototype, and repository links remain available inside the relevant case study. [View all work on Behance](https://www.behance.net/muhammadsahlanshadiq) opens a new tab. Modified clicks preserve native link behavior.

Exactly eight Image Gen images form four related compact/expanded pairs. The expanded images change composition, rather than enlarging the compact crops. [The asset record](assets.md#selected-work-banners-27-september-2026) separates this concept artwork from original project evidence. [The unchanged generation manifest](selected-work-banners.json) retains every exact prompt, source URL, original generator path and shipping WebP path. Each shipping file also has its exact prompt in an adjacent `.webp.json` sidecar. Generated screens, scene photography and sample values establish no original project contribution, production use or outcome claim.

## Verification and review

The implementation session reported 43 unique passing Playwright checks across selected-work, Aurelia, project entry, pointer enhancements and home. After the spacing correction, all 23 affected selected-work/Aurelia/home checks passed again. Lint, type checking and the production build passed; the final build also passed after that correction. Asset checks found eight distinct hashes, all eight images loaded after activating their rows, and the metadata scan reported eight rasters with no missing provenance. A later loading optimization is measured below. The metadata and provenance checks remain unchanged.

## Image loading optimization, 29 September 2026

Expanded artwork now loads only when a row becomes active. On a 390px Chromium viewport with a cold browser context, 4× CPU throttling, 150ms latency and a 1.6Mbps download cap, the opening homepage transfer fell from 439,633 bytes to 357,698 bytes (about 80KiB, or 18.6%). The initial image requests fell from all eight gallery images to the four compact banners; the portrait and logo still load normally. In this single lab comparison, FCP was 1.128s before and 1.124s after, LCP was 1.164s and 1.140s, and CLS remained 0.00. These are local measurements, not field performance scores.

The [review folder](../.impeccable/review/selected-work/) contains the supplied reference, default desktop, all four expanded desktop states, default/expanded 719px views, mobile and homepage context. The [independent finish review](../.impeccable/review/selected-work/finish-review.md) requested two fixes: compact-row index/arrow grouping and reference-width density. The [final verdict](../.impeccable/review/selected-work/finish-verdict.md) marks both resolved and returns ship for those two fixes. The 719px expanded capture is 655px tall against the reference's 651px, with the first banner at y106 in both. That limited verdict does not claim an exact whole-page match or a complete portfolio release.

## Context comparison

PRODUCT.md still governs factual claims, native navigation, immediate actions, keyboard/touch access and reduced motion. The shipped section meets those constraints within this scope. The route and status descriptions in PRODUCT.md and DESIGN.md were updated during ticket 12 when the remaining case studies, resume, and local font were delivered. This record preserves the original selected-work implementation checks; the [ticket 12 verification](../.scratch/portfolio-halyard/ticket-12-verification.md) covers the integrated release candidate.
