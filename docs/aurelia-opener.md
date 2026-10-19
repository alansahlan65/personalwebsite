# Aurelia header opener

Reviewed 19 October 2026. The current header embeds [From a place to a plan](../public/demos/aurelia/index.html), a silent 36-second browser composition at a fixed 1920×1080 stage. It is a later Portfolio motion study.

Nine connected beats carry the hero photograph through Tirta Forest Villa's card/gallery, local planner, dates, stay, revision, and return. View image 2 changes the photograph. Check these dates retains Tirta/Ubud. The film selects 9–12 March 2027 for two adults, continues to Stay, returns through Back, and revises departure to 14 March. It ends before Contact/submission. These dates are illustrative.

Source DOM, Cormorant Garamond, Manrope, photographs, and SVG icons provide the design. A deterministic GSAP clock controls camera, masks, cursor, transforms, fields, progress, and summary, including backward scrubbing. Native date inputs have no nights counter or custom range calendar; the film reconstructs a browser popover without claiming a new Aurelia feature.

The 1.3-second hero-to-Tirta handoff overlaps distinct photographs. Camera transforms replace per-frame CSS zoom; moving composition surfaces omit backdrop blur. Scene references are cached and debug updates remain conditional. [The direction](../public/demos/aurelia/DESIGN.md), [source account](../public/demos/aurelia/SOURCE.md), and [metadata](../public/demos/aurelia/composition.json) describe this version.

Rebuild with `node scripts/build-aurelia-header.mjs`. Current CSS, JS, and DOM captures remain under `.scratch/aurelia-design-tour/`. The builder also expects the installed Bang Motion starter path it names. The [profile harness](../.scratch/aurelia-design-tour/profile-header.mjs) measures actual playback without recording overhead against the local preview. Rebuilding is not portable without those retained inputs.

The portfolio provides external Pause/Replay, viewport/background pause, persistent manual pause, poster fallbacks, and a direct composition link. Reduced motion and forced colors start settled. No JavaScript or failed initialization retains the poster/link. The visible poster has eager/high-priority loading.

The old 40-second MP4 and `render.json` are archival and are not loaded by this header. No encoded MP4 of the current revision is delivered. See [the package README](../public/demos/aurelia/README.md).
