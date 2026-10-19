# Case-study media

Reviewed 19 October 2026. `CaseMediaSequence` remains on PawFriend. Aurelia, Paylecta, and Munchpal use continuous stories with [ProjectScreen](figma-project-details.md).

## PawFriend sequence

Initial HTML/CSS is a complete readable stack. Desktop horizontal enhancement requires width at least 1000px, height at least 750px, normal motion, no forced colors, observation support, and complete panels fitting the available height. Native vertical scroll drives a sticky frame through Motion `scrollInfo` and one track transform. There is no wheel interception, snapping, or second transform owner.

Numbered/named native view links, current styling, progress, and a focus-only Skip expose navigation. Fragment/history changes select the correct panel. Keyboard focus brings panel controls into view; Skip remains outside the sticky container and preserves the current view until activated.

Resize, image load, font readiness, and observed size changes remeasure fit/travel. Preferences or larger content can restore the stack while preserving the focused/current panel. Opening full-source details can trigger that fallback. Cleanup removes observers, scroll subscriptions, listeners, and animation frames.

## Inspection and recording

Readable CSS crops retain original source images. Wide phone details permit native horizontal panning. A native View source image disclosure provides the complete original, crop context, and direct link. Keep intrinsic dimensions, useful alternatives, stable focus, and the source-resolution limit.

Observed-flow recordings use native controls, poster, dimensions, direct-file link, a text account, and `preload="none"`. They do not autoplay. Later opener playback is a separate [video/browser component](component-system.md). [Asset provenance](assets.md) and individual case records distinguish recordings, source exports, and generated concept imagery.
