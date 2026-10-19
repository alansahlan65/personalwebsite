# Site themes

Reviewed 19 October 2026. All routes, navigation, footer, and not-found content share the theme tokens in [DESIGN.md](../DESIGN.md) and [app/globals.css](../app/globals.css).

Light is the default regardless of device preference. The explicit Dark theme switch stores a choice under `portfolio-theme-v1` when permitted. An early inline script reads it before body paint; hydration reconciles changes, and tabs synchronize stored updates. Storage failure leaves the switch usable for the session. No-JavaScript pages stay light and omit inactive switches. Print uses light surfaces.

Cobalt remains `#245bff` in both themes. Filled actions retain white text; small action text/icons use cobalt in light mode and ink in dark mode. Raised neutrals differ from fields and the subdued surface. Original project imagery, role colors, gradient icons, and supplied logo shading remain authored colors.

The 88×48px switch has native switch semantics, the stable accessible name Dark theme, and a checked state. Its 36px thumb travels 40px over the shared 250ms selection duration. Keyboard focus, reduced motion, and forced colors settle immediately. The full header, compact rail, and menu share it; the compact/menu controls put it immediately left of Menu/Close.

Test both themes and runtime changes, storage denial, keyboard/touch, enlarged text, contrast preferences, no JavaScript, and print when relevant. [Quality checks](quality.md) records actual coverage.
