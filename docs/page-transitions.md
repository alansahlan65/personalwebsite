# Page navigation

Reviewed 19 October 2026. The persistent [NavigationTransition](../app/components/navigation-transition.tsx) owns ordinary internal route curtains. Route focus and scroll restoration remain coordinated with it.

## Pointer and history navigation

Five sharp horizontal cobalt bands cover, then uncover the destination. The combined animation budget is 610ms, with a 30ms stagger and `cubic-bezier(.65,0,.35,1)`. Static 16px side overscan and a 1px row overlap preserve coverage. Only transforms/opacity animate. The menu's separate stairs remain vertical.

Forward routes sweep left-to-right; Home/Back use the opposite direction. Contact-to-About also returns right-to-left. Completion promises gate route switching under full cover; repeated input retargets current motion/destination. Prefetch starts with cover. Open-menu navigation releases its lock under coverage. Back/Forward restore existing history state without adding entries.

Home goes to the root top and heading, clearing pending project-return intent. Identical idle destinations preserve the history entry. Same-page sections retain native scrolling. Direct visits and reloads do not play a route curtain. [Project entry](project-entry.md) owns gallery snapshots separately.

## Input and fallback

Keyboard and assistive zero-detail activation bypass the curtain through native Next navigation, closing any menu and cancelling active pointer movement. Reduced motion uses an 80ms fade; forced colors navigates immediately. Touch keeps the ordinary page curtain while shared-image spatial movement is disabled.

Curtain layers have no accessible content or pointer interception. Links, focus, and return controls remain usable. Modified clicks, downloads, external URLs, and same-page history remain native. Missing browser snapshot support does not disable ordinary navigation.

The compact header enters above 96px scroll and returns below 48px, deferring changes while focused or while the menu is mounted. The menu contains focus, supports Escape, makes the background inert, and restores focus/scroll after dismissal. A delayed-route loading/recovery design remains open in [release work](quality.md#remaining-release-work).
