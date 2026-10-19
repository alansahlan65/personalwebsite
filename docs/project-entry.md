# Project entry and return

Reviewed 19 October 2026. Gallery links request the existing React ViewTransition project identity. Ordinary route navigation uses [the page curtain](page-transitions.md).

The gallery cover and case boundary participate where matching snapshots exist. The shared-image effect uses the 520ms `cubic-bezier(.77,0,.175,1)` token; its title settles over 220ms with the project ease-out curve. Current gallery covers are 3:1 and the case headers use their own media framing. Do not restore the older 16:10 source/target geometry as a gallery requirement.

Magnetic movement stays on separate title/arrow children. Pointer feedback clears before snapshot capture; overlays pass pointer events through. Meaningful destination focus and native links remain available while imagery moves. Only gallery entry requests the shared effect, avoiding a second full curtain for the same action.

Touch, reduced motion, forced colors, direct visits, new tabs, missing source snapshots, unsupported browsers, and failed/skipped capture retain the native route and complete content. Modified clicks preserve normal browser behavior. Explicit Back to selected work and history return restore the saved gallery reading position/focus. Home navigation intentionally resets to the root top.

[Quality checks](quality.md) owns current validation; browser snapshot availability alone is not a guarantee of a matching visual morph for every header.
