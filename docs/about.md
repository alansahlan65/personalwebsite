# About

Reviewed 19 October 2026. [app/about/page.tsx](../app/about/page.tsx) owns the page composition, with scoped CSS and local client interactions.

## Content and order

The introduction pairs Hi, I'm Alan with the real supplied portrait and a concise Product Designer/CADIT/learning statement. What I do precedes Experience. CADIT uses the confirmed UI/UX Designer title, October 2025 start, component-library/UI-mockup responsibilities, and supplied client names, with a native resume download.

Learning by building contains the local Static / Motion save-button comparison. Little trivia follows the professional content. The current page omits the older Work I've done list, personal-notebook topic navigation, and A little about me anchor. Facts and positioning come from [content sources](portfolio-content.md).

## Interaction

Inline research/wireframing/prototyping triggers reveal sketches by hover, focus, or tap. Click pins a preview; Escape, repeat activation, or outside input dismisses it. Targets are at least 44px. Measured previews fit below the compact header; an inner scroller keeps long explanations keyboard-readable without breaking the hover bridge.

The portrait greeting supports keyboard/touch and Escape even when mouse activation leaves focus unchanged. The save comparison keeps its state when Static / Motion changes; reduced motion and forced colors take precedence. Label and live feedback communicate state independently of animation.

The compact trivia deck supports free bounded dragging, sideways swipes, answer reveal/hide, and Next question. Vertical movement returns the same card. A drag suppresses accidental answer clicks; cancellation, Escape, preference, and viewport changes restore the card. Active content determines height. Tall/enlarged content retains native scroll access. Keyboard/preferences settle movement immediately. No-JavaScript and print readers retain all facts.

Use [DESIGN.md](../DESIGN.md) for shared spacing, surfaces, typography, and card geometry. Paired sections stack at the viewport and text-relative container breakpoints. The portrait's responsive source sizes match its 440px cap. [Quality checks](quality.md) owns current verification.
