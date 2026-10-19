# Selected work

Reviewed 19 October 2026. Four ruled native links open local case studies in order: Aurelia / Hospitality, Paylecta / Finance, PawFriend / Pet adoption, Munchpal / Food sharing.

## Layout and behavior

Each row contains an index, title/category, one cover, and arrow. Project type/role labels are omitted from the gallery; contribution belongs in the case study. Hover or visible keyboard focus expands the same centered 3:1 image below its title, with a brief first-person story underneath. The story sits outside the scaling image and supplies the accessible description.

Focus wins over passive hover. Layout projection uses 280ms and `cubic-bezier(.23,1,.32,1)`; keyboard and reduced motion settle immediately. Keep the same image element, source, decoded artwork, and expanded-frame responsive sizing across states. Separate title/arrow children own magnetic movement while the full-row native hit area stays still.

At 700px and below or on non-hover devices, every cover/story is visible and one tap opens the case. No-JavaScript readers receive every story. Intermediate widths tighten local layout without changing the image ratio. Modified clicks preserve native behavior. [Project entry](project-entry.md) owns shared-image continuity and return position.

## Artwork and destinations

Each current cover is `public/images/work/<project>-expanded.webp`, serving both states. [The banner manifest](selected-work-banners.json) retains original prompts and retired compact records. These covers are generated decorative artwork; authentic evidence is inside the case studies. Keep this provenance even though the visible gallery omits the former banner notice.

More work on Behance opens the confirmed external profile. [DESIGN.md](../DESIGN.md) owns shared typography, gutters, focus, and radius rules; [quality checks](quality.md) owns verification.
