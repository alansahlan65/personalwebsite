# Domain docs

This project uses a single-context layout:

- `CONTEXT.md` at the repository root for domain vocabulary.
- `docs/adr/` for architectural decision records.

## Before exploring the codebase

Read `CONTEXT.md` and any ADRs relevant to the task.

If these files or directories are absent, proceed silently.
The domain-modeling skill creates them when terms or decisions
are resolved.

## Use established vocabulary

Use the terms defined in `CONTEXT.md` when naming concepts in
tickets, proposals, code, and tests.

If a needed concept is missing, check whether an existing term
already covers it. Note genuine gaps for domain-modeling.

## Surface decision conflicts

If a proposal contradicts an existing ADR, identify the ADR
and explain why the decision should be reconsidered.
