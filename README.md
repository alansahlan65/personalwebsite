# Alan Sahlan portfolio

A responsive portfolio for Alan Sahlan, a Product Designer in Indonesia and UI/UX Designer at CADIT. The site includes Home, About, Contact, and case studies for Aurelia, Paylecta, PawFriend, and Munchpal.

Reviewed against the working tree on 19 October 2026.

## Run locally

Use Node.js 20.9 or newer and npm. Install the locked dependencies with `npm ci`, then run `npm run dev`. The preview is at http://127.0.0.1:3000.

```sh
npm ci
npm run dev
```

For a production preview, run `npm run build` followed by `npm start`. Exact dependency versions and commands live in [package.json](package.json) and [package-lock.json](package-lock.json).

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Playwright uses Chromium and starts or reuses the local server on port 3000. Install its browser with `npx playwright install chromium` when needed. The [manual About browser configuration](playwright.about-engines.config.ts) also supports Firefox and WebKit. See [quality and release checks](docs/quality.md) for the latest measured results and coverage limits.

## Current implementation

Next.js App Router and React render static portfolio content; local client components provide Motion interactions. Plus Jakarta Sans is bundled as WOFF2. Light is the default, with a stored dark-theme preference. Native links, keyboard controls, reduced-motion behavior, and complete reading fallbacks support the enhanced interface.

The case studies retain original design evidence and distinguish client work, self-initiated concepts, and later portfolio motion studies. Aurelia uses a browser composition; Paylecta and Munchpal use rendered video openers. Contact prepares an email draft to the verified address and offers copy recovery. The current PDF resume is available throughout the site.

A new [40-second MunchPal HyperFrames opener](public/demos/munchpal-opener/README.md) is available for browser review alongside the current website video.

## Documentation

Start at [the documentation index](docs/README.md). [PRODUCT.md](PRODUCT.md) owns product commitments, [DESIGN.md](DESIGN.md) owns the visual system, [CONTEXT.md](CONTEXT.md) defines domain terms, and [AGENTS.md](AGENTS.md) gives contributor instructions. The [PRD](portfolio-prd-halyard.md) retains the requirements entry point under its existing filename.

Choose a public origin and set `SITE_ORIGIN` for the production build before publishing. Preview metadata currently uses `noindex`; publication and external delivery remain separate from local validation.
