# Shared component system

Reviewed 19 October 2026. [DESIGN.md](../DESIGN.md) owns shared visual values, and [app/globals.css](../app/globals.css) implements them. Use [the documentation index](README.md) for surface-specific behavior.

## Ownership

| Component or area | Responsibility |
| --- | --- |
| SiteHeader / menu | Full-to-compact navigation, dialog lifecycle, theme/resume access |
| Theme switch | Explicit stored light/dark selection and accessible switch state |
| ControlVisual | Press feedback on a painted child while the native target stays stationary |
| NavigationTransition / RouteFocus | Page curtain, input precedence, route focus/history/return position |
| Project gallery | Single-cover expansion, focus precedence, native case links |
| About interactions / notebook | Sketches, portrait greeting, save comparison, trivia gestures/answers |
| ProjectScreen | Native full-source image link and display-preview/device presentation |
| CaseMediaSequence | Conditional PawFriend horizontal media with complete stacked fallback |
| ProjectOpener | Video playback intent, viewport/visibility pause, replay and preference handling |
| BrowserProjectOpener | Aurelia iframe playback, poster/failure recovery and external controls |
| PointerEnhancements | Shared magnetic children and decorative cursor lifecycle |

## Rules

Keep native targets stationary and assign each animated transform one owner. Shared press response uses the 320/30 spring; magnetism has its separate 100/12/.8 spring. Keyboard focus, cancellation, disabled state, hidden documents, and preference changes reset movement.

Use the shared canvas/ink/action tokens, 16px controls, 28px interactive cards, pills, and theme-specific shadows. Reading and original evidence remain flat. Share repeated behavior through existing components before adding route variants. Original source geometry remains inside project artwork.

About's current learning comparison and trivia are documented in [About](about.md). The prototype comparison route and earlier card/theme experiments are superseded. [Quality checks](quality.md) owns current validation and remaining limits.
