# Pointer interactions

Reviewed 19 October 2026. [PointerEnhancements](../app/components/pointer-enhancements.tsx) owns shared magnetic feedback and the decorative fine-pointer cursor.

## Action contracts

Use `data-magnet` with separate `data-magnet-part` visual children for shared magnetic response. Text movement caps at 5px, gallery title/arrow at 6px, and controls at 8px. The spring uses stiffness 100, damping 12, mass .8, rest delta .05, and rest speed .5. Native link/button targets remain stationary. Nested magnets must not move one target twice.

Locally managed actions use `data-pointer-feedback="local"`: theme/interactive controls, disclosures, image inspection, media playback, form controls, and other components with their own stable feedback. Disabled/inert actions remain excluded. The former queried magnet-disabled attribute has no current contract.

The browser action-inventory tests cover header/menu/footer, gallery, case links and images, contact, About, recordings, and opener controls. Update the real inventory when adding actions; avoid a fixed obsolete action count.

## Cursor and lifecycle

The 7px dot follows the actual pointer in the next rendered frame. Image hover expands a 72px difference-blend disc; actionable images get a separate arrow. Position does not use a trailing easing loop. Size transitions are time-based; leaving imagery immediately restores the dot.

Text selection, editable controls, disclosures, media controls, and local-feedback actions preserve appropriate native semantics. Selection/editing stop displacement. Route/menu changes reset magnetic state and re-evaluate the cursor at the current coordinates. Geometry invalidation and pointer input batch by animation frame. Window exit, hidden documents, input/preference changes, and cleanup reset listeners/observers/frames.

Hide the native cursor only after its replacement is positioned and visible. Touch, reduced motion, and forced colors use the native cursor. Effects carry no required content and intercept no pointer events. See [DESIGN.md](../DESIGN.md) for shared feedback and [quality checks](quality.md) for coverage.
