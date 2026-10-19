# Source and production record

Reviewed 19 October 2026. This records the source used by the current 36-second composition. See [production notes](../../../docs/aurelia-opener.md) for rebuilding and [the case record](../../../docs/aurelia-case-study.md) for the complete product flow.

The source application is D:/Project/New Real Estate Landing Page Premium. Read-only inspection and a temporary workspace copy supplied its actual hero, navigation, collection cards, Tirta property modal, and booking drawer states. Original application files were not edited.

Source components: components/hero/Hero.tsx, components/properties/PropertyCarousel.tsx, components/booking/BookingExperience.tsx, lib/content.ts, and lib/stay-planner.ts. DOM, SVG icons, local fonts, and authorized concept photography were captured from the source. Asset hashes remain in assets/manifest.json. Photography is the original user-selected AI-generated imagery from that concept project.

Verified path: Stays → View stay: Tirta Forest Villa → View image 2 → Check these dates → Check-in and Check-out → Continue → Stay → Back → revised Check-out. Opening the planner preselects Tirta, Ubud, and Rest and stay in. Returning to Dates retains the property, area, two adults, and entered dates.

Photo controls are thumbnail buttons. Previous stay and Next stay switch properties, so neither advances the gallery. Date controls are native date inputs. The film's browser popover is a deterministic presentation of those native choices. The source has no custom range calendar or nights counter; no such Aurelia feature is claimed.

The film uses state-driven source DOM. Inputs, select values, thumbnail selection, progress, step visibility, and summary text derive from timeline time. The cursor and visual transforms use that clock. Backward scrubbing restores the appropriate state.

The 9–12 March 2027 dates and 14 March departure are illustrative requests. Nothing holds availability, sends a request, prepares a reference, confirms a reservation, or takes payment. Contact remains disabled and is not visited. No dummy contact details or success screen appear.

Bang Motion's fixed stage and shared camera architecture were used with the revised spec's object relay. CSS and composition JS are inline in index.html; dependencies are local. No MP4 was exported for this revision. Existing MP4 metadata describes the superseded film.
