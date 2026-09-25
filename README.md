# Alan Sahlan portfolio

Next.js, React, and TypeScript implementation of the approved portfolio specification.

## Local development

Install dependencies with `npm ci`, then run `npm run dev`. Open http://127.0.0.1:3000.

## Checks

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npx playwright install chromium` once, then `npm test`

Browser tests start the development server automatically when one is not already running. They exercise visible identity, section navigation, keyboard skip navigation, responsive overflow, media readiness, reduced motion, and enlarged text.

## Current scope

Ticket 01 provides the responsive homepage foundation. Ticket 02 adds the About route, email contact action, and confirmed professional links. A current resume and factual About detail on product-problem approach and developer collaboration remain pending. Later tickets implement project routes and interaction systems. See [content sources](docs/portfolio-content.md).

Halyard web-font delivery is still missing. The current neutral fallback is temporary; do not treat the font requirement as complete. The approved composition image also needs to be supplied for direct visual comparison. See [asset record](docs/assets.md).

The development preview is marked noindex until release acceptance. The default framework not-found screen is temporary; ticket 12 provides the portfolio-specific recovery experience.

Requirements are in [the PRD](portfolio-prd-halyard.md), [the spec](.scratch/portfolio-halyard/spec.md), and [the implementation tickets](.scratch/portfolio-halyard/issues).
