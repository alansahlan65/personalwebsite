# PawFriend case study

Ticket 10 adds `/work/pawfriend` and connects gallery row 03 to the local case study. The approved order and existing generated banner pair remain in the integrated gallery. An independent committed gallery uses an authentic live-site screenshot. Both versions keep one row link, shared-image entry, native modified clicks, focus precedence, and saved return position.

## Source and attribution

The [supplied live PawFriend concept](https://pawfriend-topaz.vercel.app/) returned HTTP 200 and was inspected in Chromium 153.0.8010.12 on 27 September 2026 at 1440 × 900. The supplied PRD and ticket identify PawFriend as a self-initiated concept. No separate PawFriend case-study PDF was supplied or linked from the inspected site.

The supplied GitHub profile exposed the [PawFriend repository](https://github.com/alansahlan65/pawfriend), whose configured homepage matches the live site. Its README, PRODUCT.md, DESIGN.md, image-provenance manifests, and shortlist source were inspected. The latest public revision at review was `eae7711`. The public brief confirms local sample profiles and no connected adoption backend. The shortlist code reads/writes local storage, filters saved IDs against current resident IDs, and retains session state after storage failures. These are source observations, separate from the recorded reload test.

The site has no author credits establishing individual design/development responsibility or collaborators. Public Git history records Alan's account and an AI bot account; it cannot establish sole human authorship or design direction. A firsthand contribution question is pending; the page currently describes the design focus without claiming sole design or development authorship.

Text fetching could not reach the live site, the Firecrawl CLI was unavailable, and the built-in browser could not initialize due to a Windows sandbox setup error. Direct Chromium inspection provided current source evidence. The source HTML, text, link inventory, original viewport captures, and observed event text remain in ignored runtime storage.

## Observed evidence

| Starting state and action | Observed result | Portfolio use |
| --- | --- | --- |
| Open Saved with zero pets | Empty drawer explains saving and offers Browse the residents; share is disabled | Recording establishes starting state |
| View all nine residents | An inline grid opens with nine sample profiles, extending the five-pet featured carousel | Catalog panel |
| Save Milo, then Luna | Header count becomes two; drawer contains both profiles; saved confirmation appears | Shortlist panel |
| Close drawer with Escape | Browsing resumes | Recorded reversal |
| Plan a meeting | Opens first-visit preparation guidance, not a booking form | Preparation panel |
| Reload the same browser | Both saved profiles remain | Present build's local persistence observation |
| Remove Milo in the drawer | Luna remains and saved count becomes one | Recorded reversible selection |

No share action, contact submission, or real adoption transaction was exercised. All screenshots and recording frames show the actual live concept, with no reconstructed interface. The capture used instant native scrolling to align headings after source entrance animations and visible images settled.

The concept profiles, ages, personality descriptions, and availability are sample content. Original asset manifests document the hero and resident portraits as generated imagery, with prompts retained in PNG sources. No new pet imagery was generated for this case study. The page omits the site's illustrative Luna adoption story as a historical result. It claims no real shelter partnership, research sample, usability result, adoption increase, or measured outcome. Descriptions of visible hierarchy and next-step choices are current readings of the interface. Implementation notes distinguish source-verified storage handling and observed same-browser persistence from future production requirements.

## Media and delivery

| File | Source state | Dimensions | Bytes |
| --- | --- | --- | --- |
| `public/images/pawfriend-interface.webp` | Initial homepage | 1440 × 900 | 70,210 |
| `public/images/pawfriend-catalog.webp` | Expanded resident grid | 1440 × 900 | 88,180 |
| `public/images/pawfriend-shortlist.webp` | Milo and Luna in saved drawer | 1440 × 900 | 63,814 |
| `public/images/pawfriend-prepare.webp` | First-visit preparation | 1440 × 900 | 53,510 |
| `public/media/pawfriend-observed-flow.webm` | Actual live browsing, saving, preparation, reload, and removal | 1440 × 900 | 1,608,782 |

Images preserve the full browser viewport and use WebP quality 85. JSON sidecars record source URL, capture date, browser/viewport, original capture hash, preparation, state, and evidence limits. The static social JPEG uses the same original hero screenshot; its alternative-text file has no trailing newline to avoid Windows line-ending metadata duplication. Original PNGs remain unchanged in ignored source storage. Source image manifests establish generated concept imagery, not real animals or verified shelter records.

The hero preloads a responsive image. Below-fold panels use the shared media sequence with actual dimensions and source captions. Desktop native vertical scrolling drives three panels, progress, and Skip. Keyboard image actions expose the correct panel; stacked views preserve the same content. The longer notes and original live recording stay in vertical flow. The native player has controls, dimensions, a poster, a text account, a direct-file link, and `preload="none"`; it does not autoplay.

The title uses a smaller fluid scale to keep PawFriend intact in the split introduction. PawFriend's text can wrap long words at enlarged sizes so the 320px reading view fits. These changes preserve the existing visual system. No new animation or interaction library was added.

## Verification

The approved boundary is the running website in a real browser. The direct-entry test failed before the route existed, and the gallery-entry test failed before row 03 connected locally. Focused coverage verifies source-based content and metadata, loaded authentic images, sibling keyboard traversal and rapid hover, shared entry, native new tabs, Back/Forward and saved return, media progress/reversal/skip, runtime size/motion/forced-color changes, 320–1440px and enlarged text, touch one-tap entry, no JavaScript, deferred native video playback, and new pointer actions.

The 320px enlarged-text check exposed overflow before the scoped long-word wrapping correction. The gallery-return fixture waits for the visible heading's click actionability before measuring departure, avoiding a position captured during row expansion. It checks restoration within one native scroll pixel, alongside destination, focus, and history assertions. The older touch journey waits for its synthetic fling to stop before moving to and tapping the intended project. The pointer check scopes application actions to the case study, excluding the development server's debug toolbar.

Final checks and independent review results are recorded with ticket 10. The production domain for absolute social URLs remains a site-wide release setting. Browser emulation establishes no physical-device or untested-browser result.
