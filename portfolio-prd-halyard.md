# Alan Sahlan portfolio PRD

Version: 2.1 | Updated: 24 September 2026
Status: Approved visual direction with explicit interaction requirements.
Primary emphasis: Interaction design, supported by product design and frontend implementation.

## 1. Purpose and authority

Build a distinctive personal portfolio for Alan Sahlan, a UI/UX Designer at an IT consulting company. Product Designer opportunities are the primary hiring focus. Alan is learning toward Design Engineer roles and is open to those opportunities. The primary audience is hiring managers and design leads, with engineering leads also able to assess his developing implementation capabilities.

Present design engineering as the ability to implement and refine interactive interfaces and bridge product design with development: understand technical feasibility, explain constraints and trade-offs, and translate design intent into actionable implementation guidance. Support capability claims with evidence; do not imply established Design Engineer employment history.

The portfolio itself must demonstrate interaction craft. Visitors should experience responsive feedback, smooth transitions, coherent motion, and reliable behavior while assessing the work. The visual design should remain minimal, neat, and easy to scan. Motion should reveal information, communicate state, preserve continuity, or respond to input.

This document supersedes the previous PRD and conflicting design examples in older handoff documents. Follow the latest explicit requirements over the generated reference image. In particular, use Halyard Display Variable everywhere, even though the approved image contains serif typography in its second section.

The attached approved homepage image is a composition reference: name at left, inset portrait at right, Indonesia marker, role bands second, inline project gallery, compact About, and a straight-edged cobalt footer. It is not an exact typography specification, an actual portrait of Alan, or proof of live project functionality.

## 2. Locked decisions

| Area | Requirement |
| --- | --- |
| Visual character | Minimal, modern, editorial, spacious, and distinct from Dennis Snellenberg's layout |
| Typeface | Halyard Display Variable across the entire site |
| Colors | Warm off-white, charcoal, and cobalt blue |
| Hero | Separate name-and-portrait composition with minimal role text; no hero CTA |
| Second section | Design / Build / Refine, implemented as scroll-linked Text Parallax |
| Selected work | Inline image-slide gallery using width animation from 0 to auto |
| Clickable elements | Magnetic feedback across all links and buttons on compatible pointer devices |
| Cursor | Small following dot, expanding into an inverted-color circle over images; arrow for clickable image targets |
| Header | Full navigation at the top; compact hamburger appears only after scrolling |
| Expanded navigation | Sliding Stairs Menu, replacing the earlier curved-menu choice |
| Project pages | Smooth entry transition and desktop horizontal media sequence, followed by vertical reading |
| Homepage content | Hero, role parallax, selected work, compact About, contact/footer |

Do not restore the transaction-widget hero, hero pill button, separate "In the details" demonstration, Experiments section, curved menu, curved charcoal footer, or additional marketing sections. Keep interaction evidence inside the portfolio's behavior and relevant case studies.

## 3. Visual system

### Typography

Use Halyard Display Variable for headings, role bands, project titles, navigation, buttons, labels, case-study copy, and footer. Apply inheritance to form controls and interactive elements. Use a neutral sans-serif fallback while the font loads. The AS logo remains a graphic asset; text already inside project screenshots retains the project's identity.

Start with weights 400 for body text, 500 for controls and metadata, and 500 or 600 for large display text. Establish hierarchy through scale, spacing, and weight within this one family. Do not introduce a serif accent or substitute Inter because a reference or design skill recommends it.

Use fluid type sizing. Large names and role text must fit the composition without distorted letterforms. Avoid copying the serif screenshot's exact line lengths after changing the font. Recalculate text width, capsule placement, and repeated track length after fonts load.

### Copywriting

Apply the better-writing skill to all website copywriting. Use clear, brief language, consistent terminology, meaningful link labels, and sentence case by default. Preserve the exact approved hero phrase "Design • Engineer". About and contact wording identified as starting copy can be refined within the agreed positioning; the current UI/UX Designer role and developing engineering capabilities must remain accurate.

### Color and composition

| Token | Starting value | Use |
| --- | --- | --- |
| Background | #F6F5F1 | Main page canvas |
| Text | #20221F | Primary text |
| Secondary text | #62625E | Supporting labels |
| Accent | #245BFF | AS identity, location marker, small details, contact footer |
| Divider | #DDDDD5 | Fine separators |

Check contrast in the actual interface. The blue is the approved mockup's working accent, not a color sampled from the original AS asset.

Preserve the approved image's asymmetric hero, rectangular portrait crop, blue corner detail, small ID/Indonesia signature, and generous margins. Use that corner detail sparingly as a recurring identity element. Avoid copying Dennis's full-bleed gray portrait, moving surname overlay, globe badge, and curved footer as a package.

Use a consistent desktop grid, roughly 64–80px outer gutters at a 1440px viewport, and comfortable mobile gutters. These are starting measurements, not fixed values for every screen. Round the role-photo capsules and project imagery where the reference calls for it; do not put every section into a card.

## 4. Routes and homepage content

| Destination | Route |
| --- | --- |
| Home | / |
| Selected work | /#work |
| About | /about |
| Contact | /#contact |
| Case study | /work/[slug] |
| Resume | Verified downloadable or viewable PDF |

### Section 1: Portrait hero

Header: AS mark and Alan Sahlan at left; Work, About, Contact, and Resume at right.

Hero: large "Alan Sahlan." on the left and an inset portrait on the right. Keep the name separate from the photo. Supporting text is exactly "Design • Engineer". This is identity copy, not an employment title or a change to the Product Designer hiring priority. The About copy must state the actual current UI/UX Designer role and explain the developing engineering direction.

Place a compact cobalt ID square beside "Based in Indonesia" in the lower-left area. This is a distinctive location marker, not a button unless a real action is deliberately added. Do not invent a city, coordinates, live local time, or availability status.

No hero CTA, explanatory paragraph, app widget, or long loading introduction. A short entrance may reveal the name and portrait, but links must be usable immediately. Use Alan's real portrait for release. Keep any substitute explicitly marked during development.

### Section 2: Design / Build / Refine

This section must come immediately after the hero. Show three oversized repeating tracks:

1. Product Designer
2. Design Engineer
3. Interaction Designer

Insert landscape photographs in horizontal capsules between repeated phrases. Keep the capsule rhythm from the Text Parallax reference, but use Halyard Display Variable for all three tracks. Ocean, mountain, and coastline imagery can establish a consistent photographic family. They are decorative images, not claims about Alan's location or projects.

Use only the small section label "Design / Build / Refine" and the role text. Detailed behavior is specified in section 5.

### Section 3: Selected work

| Order | Project | Category | Slug |
| --- | --- | --- | --- |
| 01 | Aurelia | Hospitality | aurelia |
| 02 | Paylecta | Finance | paylecta |
| 03 | PawFriend | Pet adoption | pawfriend |
| 04 | Munchpal | Food sharing | munchpal |

Use a typographic index with fine separators. Each desktop row has a number, intact project name, expandable image between the name and category, and a northeast arrow. Do not move the image below the title into a full-width card. The entire row is one semantic project link with a single keyboard stop.

Keep homepage metadata brief. Show accurate contribution and concept/client status in the case-study introduction; add one compact status line to a row only if needed for clarity. Do not split project names into arbitrary words just to imitate the reference.

The approved image depicts one hovered row. It does not require Aurelia to stay permanently open. Pointer and focus states control which row is active.

### Section 4: Compact About

Use a small About label, the blue corner detail, one short introduction, and "More about me".

Starting copy: "UI/UX Designer at an IT consulting company. Bringing design and frontend craft closer together."

Keep the About page concise: current work, approach to product problems, collaboration with developers, current learning, and resume access. Use specific verified examples where available. Do not add a second homepage portrait, long autobiography, or skills-rating charts.

### Section 5: Contact and footer

Use a solid cobalt block with a straight top edge, off-white text, and generous space. Starting copy is "Let's work together." with an unboxed diagonal arrow, inviting employment and collaboration. Make the contact text and arrow one clear action opening an email draft to Alan's verified address. Keep LinkedIn available as a secondary contact option.

Include verified LinkedIn, GitHub, Behance, and Resume links, plus the AS mark and copyright. Do not invent email addresses, profile URLs, or inactive links. Apply the magnetic system to these actions.

## 5. Interaction specifications

These are functional requirements, not optional finishing effects. A static page that resembles the screenshot is not complete.

### I-01: Scroll-linked text parallax

Reference: https://blog.olivierlarose.com/tutorials/text-parallax

Map the section's progress through the viewport to horizontal track positions. Adjacent tracks move in opposing directions, and reversing scroll reverses movement continuously. When scrolling stops, the tracks settle and stop. Do not replace this with a time-driven autoplay marquee or a one-time slide-in reveal.

Repeat phrases and capsule images enough to cover the viewport throughout the movement. Clip decorative overflow inside the section without creating a page-level horizontal scrollbar. Different starting offsets should produce the reference's staggered composition.

Recalculate on resize and font readiness. Keep one semantic copy of each role available to assistive technology and hide decorative duplicates. Touch scrolling can drive this effect normally. Under reduced motion, show the three readable labels and images without horizontal travel.

Pass condition: slow scroll, fast scroll, reverse scroll, and stop all produce predictable positions without gaps, snapping, clipped essential labels, or delayed catch-up.

### I-02: Inline image gallery, width 0 to auto

Reference: https://blog.olivierlarose.com/tutorials/image-slide-project-gallery

On fine-pointer hover, animate the image container from `width: 0` to `width: auto`. Give its inner media an explicit responsive size so the expanded width can be measured. The surrounding text should move apart as the container grows. On pointer exit, reverse to zero. This must produce actual horizontal layout expansion, not just fade an image into reserved blank space or reveal an image below the row.

Keep rows vertically stable during pointer interaction by reserving the required row height. Use overflow clipping on the image container, preserve crop/aspect ratio, and avoid stretching the image. Keep the hit area stable while visual children move.

Only one row is visually active at a time. Keyboard focus takes precedence over passive hover and exposes the preview without delaying link activation. Leaving the gallery resets the pointer preview unless a row still has focus. Rapid movement must retarget existing animation instead of queuing full sequences.

On touch-only devices, present visible thumbnails in a compact stacked layout. One tap opens the case study; do not require a preview tap first. Reduced motion uses visible or immediate previews with no width tween.

Pass condition: entering at either edge, crossing child elements, moving between rows, keyboard traversal, and leaving midway through expansion do not flicker, retrigger endlessly, or change the destination.

### I-03: Magnetic feedback for every clickable element

Reference: https://blog.olivierlarose.com/tutorials/magnetic-button

Apply one reusable magnetic behavior to the logo/home link, desktop navigation, hamburger and close controls, menu links, project links, About link, contact action, social links, resume, and case-study actions. Do not limit it to the main contact button.

Measure pointer displacement relative to a stable target center. Move the visible child toward the pointer with restrained spring response, then return it smoothly to rest on exit. The semantic anchor/button and its hit area remain stationary. For large project rows, give the title/arrow group a subtle magnetic response while keeping the row and inline gallery layout stable. Use separate nested wrappers for magnetism and width/route animations.

Use stronger movement for large standalone controls and smaller movement for text links. Do not let nested magnets apply twice to one action. The cursor may lag visually, but clicks always follow the actual pointer coordinates. No action waits for a magnetic animation to finish.

For touch, keyboard, reduced motion, and forced-colors use stable controls with equivalent focus/press feedback. This is an input-mode fallback, not permission to omit magnetism from pointer-accessible links. Do not make static text or decoration interactive merely to animate it.

Pass condition: every action is included in an interaction inventory and can be clicked immediately at the expected position, including during movement.

### I-04: Following cursor and negative-color image state

On supported fine-pointer devices, show a small following dot with slight smoothing. Over images, expand to a circular treatment that visibly inverts the underlying image colors. Over clickable project imagery, include a northeast arrow. Non-clickable portrait or decorative imagery must not acquire a misleading link arrow.

Use a compositing approach such as `mix-blend-mode: difference` with a light cursor layer, verifying the actual stacking context and resulting color inversion. An opaque black disc or frosted-glass circle is not equivalent. If the arrow needs separate treatment for clarity, keep the inversion disc and arrow in separate layers.

The cursor overlay is decorative, hidden from assistive technology, and has `pointer-events: none`. It must never intercept clicks or become a second source of hover state. Restore the native cursor for text selection and other contexts where its meaning matters. Hide the custom cursor when the pointer leaves the window, touch input is active, reduced motion is enabled, or the enhancement fails.

When used as a replacement, hide the native cursor only after the custom cursor is ready. Handle menu and route transitions without leaving a large cursor stuck on-screen. Magnetic element movement and cursor following must use the same real pointer input, not feed back into each other.

Pass condition: compare light and dark image areas, text selection, link activation, window exit/reentry, and fast target changes. The effect remains legible and does not obscure the information being inspected.

### I-05: Full header becomes compact navigation after scrolling

At the top of a page, show all primary navigation links and the brand. Do not show a hamburger alongside the full top navigation as the default design.

After a small scroll threshold, transition the links into a fixed compact Menu/hamburger control. Proposed starting thresholds: enter compact mode after 96px; restore full mode below 48px. These different thresholds prevent flicker near the boundary. Tune the values in the actual layout and store them centrally.

Make the change a short coordinated transition with no header-height jump or duplicate interactive controls. Hidden links leave the tab order. Do not remove a focused link mid-use; defer the visual mode switch until focus leaves that header region. Freeze mode changes while the menu is open.

On narrow screens, keep the same full-navigation-at-top rule. Use a compact two-row arrangement if needed rather than replacing it with a hamburger before scrolling. Preserve readable text and usable targets. Handle restored scroll positions and direct project loads correctly.

Pass condition: scroll up/down repeatedly around the threshold, use keyboard focus during the change, refresh while scrolled, and close the menu without navigation disappearing.

### I-06: Sliding Stairs Menu

Reference: https://blog.olivierlarose.com/tutorials/sliding-stairs-menu

Opening the compact menu triggers staggered vertical panels that form the reference's stair-like screen transition. Use five panels as the initial configuration. They reveal a full navigation view with large Work, About, Contact, and Resume links, then the smaller professional links. Closing reverses or coordinates the same system without a flash of hidden content.

Use the site's cobalt, off-white, and charcoal palette and Halyard Display Variable. Preserve the reference's sliding/repeating link-hover treatment in a restrained form: a hovered menu row reveals a moving repeated label/image strip, and leaving restores the readable static label. It should not add explanatory copy. Decorative repetitions are not extra links or screen-reader content. Stop any repeating movement when the target is no longer active or the menu closes; provide a static equivalent for reduced motion.

Represent `closed`, `opening`, `open`, and `closing` explicitly. Repeated toggles should honor the latest intent, not queue transitions. Keep a usable close button throughout, including during opening. Choosing a route closes the menu as part of one coordinated navigation sequence.

Use an accessible labelled dialog/navigation pattern, visible focus, Escape closing, background inertness, and focus containment. Restore focus to the trigger when dismissed, or move focus appropriately to the destination after navigation. Lock and restore document scrolling without changing the saved page position. Native modified-click/new-tab behavior must remain available on links.

Pass condition: interrupt opening with Escape, rapidly toggle, activate a link before all animation finishes, resize while open, and use browser Back. No invisible overlay, lost focus, or persistent scroll lock remains.

### I-07: Project opening and return

Activating a project connects its inline preview to the destination hero through a short image expansion/shared-image transition, with the title settling into place. Preserve image crop continuity and stable dimensions. Use a fallback when no source preview exists, including touch entry, direct URL visits, and new tabs.

Keep navigation independent of animation success. Do not intercept modified clicks. Avoid stacking a complete stairs animation and a complete image transition for the same action. A menu route uses its coordinated close; a gallery route uses the image transition.

Restore the selected-work scroll position when returning. Manage route focus so a screen-reader or keyboard visitor starts at the destination's meaningful content. If the transition fails, the project must still open.

### I-08: Horizontal project media

Reference: https://blog.olivierlarose.com/tutorials/horizontal-section

After a concise vertical project introduction, use ordinary vertical scrolling to advance three or four desktop media panels horizontally. Each panel should demonstrate one workflow, interaction, or decision with brief accompanying text. Provide progress and a working skip link.

Keep longer research and implementation explanations in normal vertical flow. On narrow screens and reduced motion, stack the same content. Keyboard focus must never disappear into an offscreen panel. Recalculate pinning and track travel after resize or media changes, and clean up when navigating away.

This is separate from the entrance transition. The reference's public page describes the mechanism; implementation must not depend on access to its paid source.

## 6. Motion system and implementation constraints

Use shared tokens for timing, easing, magnetic strength, cursor smoothing, and scroll distances. The following are proposed tuning values, not measurements of Olivier's demos:

| Behavior | Starting specification |
| --- | --- |
| Press/color feedback | 120–180ms |
| Header mode change | 200–300ms |
| Gallery width reveal | 350–450ms, responsive ease-out, reversible |
| Cursor size change | 160–220ms; positional following tuned separately |
| Magnetic displacement | About 3–6px for text links, up to 10–16px for large controls |
| Stairs transition | About 450–650ms total including stagger |
| Project entrance | About 450–600ms without blocking navigation |
| Role parallax | Scroll progress, not a fixed-duration autoplay loop |

Tune by testing interruptions and direct manipulation, not screenshots alone. Avoid rubbery overshoot or slow settling that makes controls difficult to use. Prefer transform and opacity for movement except the required gallery width animation; isolate and profile that layout-changing effect.

Default implementation for an empty repository: React, TypeScript, and Next.js, with static portfolio content and client-side interaction components. Preserve an appropriate existing stack. Use Motion for React for the reference-style width, parallax, menu, and magnetic behavior. GSAP/ScrollTrigger is an option for the horizontal case-study section when it materially simplifies the implementation. Never let two animation systems own the same element's transform.

Native scrolling is the baseline. Lenis is optional if it improves the tested experience without breaking anchors, keyboard scrolling, touch, browser restoration, or reduced motion. Smooth animation does not require intercepting every scroll input.

Use pointer events, animation values or requestAnimationFrame rather than rendering the entire page on every pointer movement. Measure bounds when needed and invalidate them on layout changes. Clean up listeners, observers, animation frames, and scroll triggers. Pause unnecessary work when the page is hidden.

Separate navigation state, gallery active state, cursor mode, and individual magnetic offsets. Define precedence: menu interaction owns pointer feedback while open; keyboard focus owns the active gallery item; reduced motion disables spatial enhancements without disabling actions.

## 7. Project evidence and content

Each case study leads with the user problem, Alan's actual contribution, and consequential design decisions, followed by interaction evidence and implementation considerations. The introduction identifies the project, audience/problem, actual role, collaborators, status, and available live/source links. Aurelia and PawFriend are self-initiated concept projects. Verify all other contribution and project-status labels before publishing.

All four projects remain complete case studies with the required introduction and media sequence. Give each the depth its evidence supports rather than equal page lengths. Horizontal media panels explain workflows and decisions instead of merely displaying screens; longer explanations must add useful evidence or reasoning.

Selective new interaction demonstrations may be built for existing projects. Clearly label these as later explorations and distinguish them from original project contributions. A later exploration is not evidence of past production use, original implementation work, or historical testing results.

Prioritize interaction evidence: show the starting state, user action, feedback, destination state, and what happens when the action is reversed or interrupted. Explain one or two consequential choices, such as preserving context during navigation, handling empty results, or adapting an interaction for touch. Include actual implementation or recording evidence where available. Do not invent testing, production usage, or accessibility results.

Portfolio sources:

- [Portfolio folder](https://drive.google.com/drive/folders/1YwKPT4-W4oxw86BXdkGfbNmRJBKjQBjF?usp=sharing)
- [Paylecta case study](https://www.behance.net/gallery/231653665/Finance-Management-Dashboard-UIUX-Case-Study)
- [Munchpal case study](https://www.behance.net/gallery/227166295/Food-Sharing-Mobile-App-Munchpal-UIUX-Case-Study)
- [PawFriend](https://pawfriend-topaz.vercel.app/)
- [Aurelia](https://aurelia.alansahlanwork.workers.dev/)

Read these sources when writing factual content. Earlier summaries are not a substitute for verifying current material. Recheck Paylecta's outcome metrics and testimonial/persona provenance, and Munchpal's task-time/completion figures before reuse. Omit unsupported results. Confirm resume content and remove any AI-directed instruction or keyword block if still present.

Required release assets: original AS mark, real portrait, selected project crops/recordings, landscape capsule photos, current resume, verified contact links, and evidence for any claimed outcomes. Use rights-cleared assets. Generated mockup portraits and invented project screenshots are layout placeholders, not final evidence.

## 8. Responsive, accessibility, and quality requirements

Validate at 390px, 768px, and 1440px, with an additional 320px overflow check. Also test intermediate widths where the hero or gallery changes layout. Preserve the name, role, navigation, work, and contact actions without clipping. Decorative track overflow must not affect document width.

All actions must work using keyboard and touch. Use semantic links/buttons, visible focus, sensible tab order, useful image alternatives, sufficient contrast, and comfortable targets. The custom cursor and decorative repetitions must not be required to understand or operate the site.

Respect reduced-motion preferences from initial render and when changed during the session. Disable magnetic displacement, the following cursor, spatial text parallax, animated gallery expansion, and elaborate route/menu movement while preserving immediate feedback and complete content.

Optimize and size images, reserve their aspect ratios, load the hero deliberately, and defer below-the-fold media. Lazy loading must not cause hover previews to appear blank. Avoid loading every project video on the homepage. Record performance measurements and test conditions rather than asserting scores without measurement.

Provide descriptive page titles, metadata, social previews, favicon, a working not-found page, and direct case-study URLs. No database, authentication, CMS, blog, or production booking service is required.

## 9. Acceptance checklist

| Test | Required result |
| --- | --- |
| Typeface inspection | Halyard Display Variable is used throughout, including role bands and menu |
| Homepage order | Hero, role parallax, work, About, contact; no discarded demo section |
| Hero review | Approved split composition, original AS/Indonesia identity, no hero CTA |
| Scroll stop/reversal | Role bands stop/settle and reverse with scrolling; no autonomous marquee |
| Gallery inspection | Actual inline width 0 to auto reveal, stable rows, working link |
| Fast gallery traversal | No queue, flash, stuck state, or hover-loop flicker |
| Clickable inventory | Every pointer-accessible link/button has appropriate magnetic feedback |
| Magnetic activation | Click coordinates and focus remain predictable during movement |
| Cursor over imagery | Visible negative-color effect; arrow only for actionable targets |
| Top/scrolled header | Full links at top; compact control after threshold; no flickering or focus loss |
| Menu interruptions | Stairs and link effects stop/reverse cleanly; latest user intent wins |
| Menu accessibility | Escape, focus containment/return, and body-scroll restoration work |
| Project navigation | Direct loads, normal clicks, new tabs, Back/Forward, and return position work |
| Horizontal media | Scroll and skip work; focused content stays reachable; stacked fallback works |
| Touch and reduced motion | All content/actions remain available without pointer effects |
| Runtime verification | Type checks, lint, build, and targeted behavior tests pass; relevant console errors resolved |
| Release content | Real assets and verified claims; later explorations labelled separately from original work; no placeholders, invented links, or unsupported outcomes |
| Positioning and copy | Product Designer hiring priority, exact "Design • Engineer" hero, accurate current role, and better-writing applied throughout |

Inspect motion in a real browser. Provide short recordings of the header/menu, gallery/cursor/magnetism, text parallax, and one case-study journey so Alan can review actual behavior. Report untested browser/device coverage. Static screenshots alone do not satisfy interaction acceptance.

## 10. Delivery sequence

First inspect the repository and assets, then record the confirmed tokens, typeface, and interaction state definitions. Build the minimal responsive layout without reopening the approved direction.

Next complete one working interaction path: full-to-compact header, stairs menu, one magnetic gallery row, negative-color cursor, and a real project route. Add the second-section text parallax and check how the systems behave together before duplicating the gallery pattern across all four projects.

Finish the case-study media sequence, remaining content, About, and contact. Test interruptions, touch, keyboard, reduced motion, browser history, and performance. Refine motion based on observed behavior while preserving the page's minimal composition.

The build is complete only when the interaction checklist is met and the result is visually reviewed. Do not mark a static approximation complete or quietly replace the requested effects with generic fades.

## 11. Authoritative interaction references

- [Text Parallax](https://blog.olivierlarose.com/tutorials/text-parallax): second-section scroll-linked tracks and image capsules.
- [Image slide project gallery](https://blog.olivierlarose.com/tutorials/image-slide-project-gallery): inline width-auto expansion.
- [Magnetic button](https://blog.olivierlarose.com/tutorials/magnetic-button): pointer attraction and return.
- [Sliding Stairs Menu](https://blog.olivierlarose.com/tutorials/sliding-stairs-menu): staggered panel transition and sliding link treatment.
- [Horizontal Section](https://blog.olivierlarose.com/tutorials/horizontal-section): project media scrolling.

These references define interaction mechanisms. Alan's approved composition, blue identity, Halyard Display Variable, sparse copy, and current requirements define the finished portfolio. Skill-calling workflows remain separate from this PRD.
