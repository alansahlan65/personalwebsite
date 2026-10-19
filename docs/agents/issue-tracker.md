# Issue tracker: local Markdown

Reviewed 19 October 2026. Active issues/specifications live under `.scratch/`. Read [triage roles](triage-labels.md) before assigning status.

## File conventions

- Feature directory: `.scratch/<feature-slug>/`.
- Specification: `spec.md` inside that directory.
- Tickets: `issues/<NN>-<slug>.md`, numbered from `01`.
- Put the triage role in a `Status:` line near the top.
- Record completion separately as `Resolution:`; append discussion under `## Comments`.

When a skill says to publish to the issue tracker, create the local file. When fetching a ticket, resolve its number inside the relevant feature directory. This convention does not authorize external messaging or issue publication.

Completed/superseded tickets may be consolidated during an authorized documentation cleanup. First move current requirements, unresolved work, and unique evidence into the owning document from [the index](../README.md). Preserve raw source/provenance records. Avoid leaving old open checkboxes that contradict the implementation.

## Wayfinding

For `/wayfinder`, use `.scratch/<effort>/map.md` with Notes, Decisions-so-far, and Fog sections. Child tickets live in `issues/NN-<slug>.md` and state their question and `Type:` (`research`, `prototype`, `grilling`, or `task`).

Wayfinding uses a separate lifecycle: `Status: open`, `claimed` before work, and `resolved` with an appended `## Answer`. Record dependencies as `Blocked by: NN, NN`. Select the lowest-numbered open/unclaimed ticket whose dependencies are all resolved. Append the answer summary and ticket link to the map.

Wayfinding lifecycle statuses are separate from triage roles.
