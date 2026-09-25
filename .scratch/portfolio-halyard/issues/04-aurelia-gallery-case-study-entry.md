# 04: Aurelia preview-to-case-study journey

Status: ready-for-agent

**What to build:** Visitors can preview Aurelia through one working inline gallery row, open a real case-study introduction, and return to their selected-work position.

**Blocked by:** 01: Responsive portrait homepage.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [x] Verify Aurelia's source material, actual contribution, authentic media, and available live/source destinations. Identify it as a self-initiated concept and omit unsupported results.
- [x] Deliver Aurelia as row 01 in Hospitality, with intact title, number, image between title and category, and northeast arrow. The whole row is one semantic link with one keyboard stop.
- [x] Implement I-02: expand the image container from width zero to auto around explicitly sized responsive media. Surrounding text moves apart; row height, crop, aspect ratio, and hit area remain stable. This is actual inline layout expansion, not a fade into reserved space.
- [x] Keyboard focus takes precedence over passive hover. Exiting reverses the preview unless focus remains; interruption retargets running animation rather than queuing it. Keep the design ready for only one active row when later projects are added.
- [x] Touch uses a visible compact thumbnail and one-tap entry. Reduced motion uses immediate or visible previews, including when preference changes during the session.
- [x] Open a direct-loadable Aurelia case study with real introduction and hero: user problem, audience, actual role/contribution, collaborators where verified, concept status, and working available links. Apply better-writing and lead with product design decisions.
- [x] Preserve ordinary clicks, modified clicks/new tabs, destination focus, Back/Forward, and selected-work return position. Navigation is functional before ticket 06 adds shared-image movement.
- [x] Browser-test either-edge entry, movement across children, repeated entry/exit, leaving mid-expansion, focus/hover precedence, touch entry, direct visit, and return navigation. Verify observable width/text movement and stable geometry with tolerances.
- [x] Size and optimize preview/hero media so initial hover is not blank. Check responsive layout and run applicable type checks, lint, and build.

## Implementation

Completed 2026-09-25. The user confirmed sole design/build authorship and approved use of the live-site screenshot. The Aurelia route and live link are in place; a public source-code link was not found. Browser coverage includes expansion geometry and interruption, keyboard focus, touch, reduced motion changes, direct visit, modified click, Back/Forward, return position, and responsive overflow. See `docs/portfolio-content.md` and `docs/assets.md` for evidence and provenance.