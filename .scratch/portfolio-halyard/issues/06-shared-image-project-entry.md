# 06: Shared-image project entry

Status: ready-for-agent

**What to build:** Visitors see Aurelia's preview connect to its destination hero while navigation, return position, and pointer feedback remain reliable.

**Blocked by:** 05: Magnetic controls and image-inverting cursor.

Source: Alan Sahlan portfolio spec, revision 2, and PRD v2.1. Follow the confirmed glossary and alignment decisions.

- [ ] Implement I-07 as a short shared-image expansion with title settling, preserved image crop, stable dimensions, and a tunable 450–600ms starting duration.
- [ ] Keep navigation independent of animation success. Provide a working fallback for absent previews, touch entry, direct URLs, new tabs, and transition failure.
- [ ] Preserve modified clicks, Back/Forward, selected-work scroll restoration, and meaningful destination focus. No user action waits for an animation to finish.
- [ ] Coordinate gallery, cursor, magnetic wrappers, and route transition so no two animation systems own the same transform and no enlarged cursor remains stuck after navigation.
- [ ] Use the menu's coordinated close for menu navigation; do not stack complete stairs and shared-image transitions on the same action.
- [ ] Reduced motion removes elaborate spatial entry while preserving content, focus, and navigation, including a preference change during interaction.
- [ ] Browser-test the full preview-to-project-and-back journey, immediate clicks during preview growth, direct/new-tab entry, history, and a transition-unavailable/failure fallback. Assert destinations and recovery rather than private animation state.
- [ ] Manually review crop continuity and timing, capture the working first-project journey, and run applicable type checks, lint, and build.
