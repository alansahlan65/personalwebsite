# Project screen delivery

Reviewed 19 October 2026. [ProjectScreen](../app/work/project-screen.tsx) is a server component shared by Aurelia, Paylecta, and Munchpal. Route-specific CSS owns screen composition and device framing.

The component renders a complete image with intrinsic dimensions and a native image-only anchor to the original. Its accessible name identifies the full-size evidence; plain captions remain outside the anchor. Presentation can be plain, phone, laptop, or monitor. This affects wrappers, not source artwork. No data-device attribute is required.

[The preview resolver](../app/lib/project-preview.ts) maps source SVGs to compressed display copies using [project-preview-assets.json](project-preview-assets.json). Originals remain the link destinations. [The Figma manifest](figma-project-assets.json), [English manifest](munchpal-english-assets.json), and adjacent sidecars retain node IDs, geometry, hashes, and adaptations.

Aurelia follows complete discovery/request sections. Paylecta combines desktop/mobile overview, customers/form, invoice editing/follow-up, payout state, and visual system. Munchpal combines audience flows, listing/chat/request/report evidence, comparisons, and bounded evaluation. Broad asymmetric layouts stack below 48rem. Munchpal's original diagrams use native Residents / Volunteers radios; both choices work without JavaScript and print includes both.

`scripts/optimize-project-svg.mjs` preserves vectors and compresses embedded photographs without increasing their dimensions. `node scripts/optimize-project-svg.mjs aurelia` updates that project's previews without rebuilding others. SVG raster fills and archived research images retain their original resolution; vector containers do not create photographic detail.

Source exports may be preserved by manifests even when not directly rendered. Preserve their provenance and complete-original access. [DESIGN.md](../DESIGN.md) owns shared spacing/radii, while [quality checks](quality.md) records current validation.
