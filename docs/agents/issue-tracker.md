# Issue tracker: Local Markdown

Issues and specs live as Markdown files under `.scratch/`.

## File conventions

- One directory per feature: `.scratch/<feature-slug>/`.
- Specification: `.scratch/<feature-slug>/spec.md`.
- One file per implementation ticket:
  `.scratch/<feature-slug>/issues/<NN>-<slug>.md`.
- Number tickets from `01`.
- Record triage state in a `Status:` line near the top.
  Use the vocabulary in `triage-labels.md`.
- Append comments and conversation history under `## Comments`.

## Publishing and fetching

When a skill says to publish to the issue tracker, create the
appropriate Markdown file using these conventions.

When a skill says to fetch a ticket, read the referenced file.
Resolve ticket numbers within the relevant feature directory.

## Wayfinding operations

For `/wayfinder`, use `.scratch/<effort>/map.md` for the map,
with Notes, Decisions-so-far, and Fog sections.

- Store child tickets in `issues/NN-<slug>.md`.
- Put the question in the ticket body.
- Record ticket type in `Type:` using `research`, `prototype`,
  `grilling`, or `task`.
- Open, unclaimed tickets use `Status: open`.
- Claim a ticket by saving `Status: claimed` before starting work.
- Record dependencies as `Blocked by: NN, NN`.
- A ticket is unblocked when every listed dependency is resolved.
- Select the lowest-numbered open, unblocked, unclaimed ticket.
- Resolve a ticket by appending an `## Answer` section and setting
  `Status: resolved`.
- Append a summary and ticket link to the map's Decisions-so-far.

Wayfinding lifecycle statuses are separate from triage roles.
