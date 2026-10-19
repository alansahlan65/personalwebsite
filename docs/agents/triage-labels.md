# Triage labels

Reviewed 19 October 2026. Use these five roles in a ticket's `Status:` line.

| Canonical role | Tracker value | Meaning |
| --- | --- | --- |
| needs-triage | needs-triage | Maintainer must evaluate the issue |
| needs-info | needs-info | Waiting for information |
| ready-for-agent | ready-for-agent | Specified for autonomous agent work |
| ready-for-human | ready-for-human | Requires human implementation |
| wontfix | wontfix | Will not be actioned |

When a skill names a canonical role, use its tracker value. Completion uses a separate `Resolution:` field under [the issue conventions](issue-tracker.md); wayfinding has its own lifecycle.
