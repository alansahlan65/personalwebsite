# Paylecta motion direction

Reviewed 19 October 2026. This describes the delivered 26-second merchant check-in, using the original [Paylecta source designs](paylecta-case-study.md). [Production notes](paylecta-opener.md) own export instructions and documented sample-data corrections.

## Sequence

| Time | Content and transition |
| --- | --- |
| 0–3s | Balance macro opens into the desktop workspace |
| 3–6s | Revenue chart and its July tooltip provide context |
| 6–9s | Invoices and Add new invoice lead into creation |
| 9–14s | Prepared form and document preview show invoice composition |
| 14–18s | Editorial cut introduces a separate mobile overdue invoice |
| 18–23s | Payouts opens existing PAY-001 / $97 / Success; row expands to detail |
| 23–26s | Retained workspace, original wordmark, closing claim, controlled loop |

Use the source orange/white/neutral UI, charcoal framing, Manrope presentation claims, and source Plus Jakarta Sans inside the product. Keep presentation corners at 24px while original UI retains its geometry. The balance, chart tooltip, form/document, and payout anchors move independently within the common camera rig.

The payout detail is the signature handoff. Preserve the reference, amount, and existing Success state while expanding the row surface. Do not animate a new payment success, invent a sent-invoice toast, or imply reminder delivery. Mobile/detail examples are separate records where source data differs.

## Source and output rules

Native SVGs and the original invoice image supply artwork; [the manifest](../public/demos/paylecta/assets/manifest.json) owns exact node IDs, originals, derivatives, and local overlays. Keep source exports intact. Original raster dimensions cap photographic/document detail. No fake interactive product behavior or historical outcome is introduced.

One deterministic GSAP timeline drives all state/visuals, including reverse seeks. Keep the final hold readable and match the loop through the retained workspace. The current delivery is silent 16:9 at 1920×1080/60fps, with a poster and accessible controls outside the artwork. This is a later portfolio study, distinct from original client work.
