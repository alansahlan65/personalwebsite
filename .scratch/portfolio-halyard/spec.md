# Alan Sahlan portfolio: product design and developing design engineering

Status: ready-for-agent
Created: 2026-09-24
Revision: 2, synthesized from the confirmed alignment session
Source: [Portfolio PRD v2.1](../../portfolio-prd-halyard.md)
Alignment: Confirmed by Alan on 2026-09-24; see [session decisions](alignment-session.md).
Testing boundary: Running website in a real browser, confirmed by Alan.

## Problem Statement

Alan wants the portfolio to help him secure Product Designer opportunities while remaining open to Design Engineer roles as he learns. His current employment title is UI/UX Designer at an IT consulting company. Visitors need to understand that positioning without mistaking a developing capability for established engineering employment.

Hiring managers and design leads need to see the problems he addressed, his actual contribution, and the reasoning behind consequential design decisions. Engineering leads should also be able to assess his design-to-development bridge: translating design intent into actionable guidance, understanding technical feasibility, and explaining implementation constraints and trade-offs.

The portfolio must make these capabilities assessable through project evidence and its own interaction quality. Motion that looks polished but delays actions, breaks keyboard navigation, or fails under interruption would undermine that evidence. Unsupported project claims or later work presented as an original contribution would also misrepresent his experience.

## Solution

Create a portfolio that leads with product design judgment and demonstrates interaction craft through both case studies and the website's behavior. Use the exact hero phrase "Design • Engineer" as identity copy. Explain Alan's current UI/UX Designer role and developing engineering direction in the About copy; retain Product Designer as the primary hiring focus.

Keep the approved Halyard Display Variable typography, warm off-white/charcoal/cobalt palette, split name-and-portrait hero, and five-section homepage: hero, Design / Build / Refine role tracks, selected work, compact About, and contact/footer. Provide a concise About page and complete case studies for Aurelia, Paylecta, PawFriend, and Munchpal.

Case studies lead with the user problem, Alan's contribution, and design decisions, then present interaction evidence and implementation considerations. Let evidence determine each case study's depth. Selective new demonstrations are allowed as clearly identified later explorations, separate from original project work and historical outcomes.

Preserve all eight required interaction mechanisms and their input-mode fallbacks. Visitors can preview work, navigate, read case studies, and contact Alan immediately, including during animation. Use "Let's work together." as contact starting copy, opening a draft to a verified email address with LinkedIn as a secondary option.

Apply better-writing to all website copy. Verify assets, destinations, contributions, and claimed results before release. The PRD defines the approved composition and behavior; the confirmed alignment decisions and glossary establish how the professional story is expressed.

## User Stories

1. As a hiring manager, I want to understand Alan's product design practice and developing design engineering capabilities immediately, so that I can assess fit for Product Designer opportunities and relevant Design Engineer roles.
2. As a hiring manager, I want the About copy to state Alan's actual current role, so that I can distinguish experience from career direction.
3. As a design or engineering lead, I want explanations of feasibility, constraints, and implementation choices, so that I can assess Alan's ability to connect design and development.
4. As Alan, I want the hero to say exactly "Design • Engineer", so that the identity expresses my direction while the About copy explains my current role.
5. As a visitor, I want to see Alan's name and real portrait in a clear split composition, so that I can identify the person behind the work.
6. As a visitor, I want a concise Indonesia location marker, so that I understand his location without unsupported detail.
7. As a visitor, I want consistent typography, spacing, and color, so that I can scan the portfolio comfortably.
8. As a visitor, I want navigation available immediately, so that an entrance animation does not delay my task.
9. As a visitor at the top of a page, I want the brand and full primary navigation, so that I can see the available destinations.
10. As a mobile visitor, I want readable full navigation at the top, so that destinations remain visible on a small screen.
11. As a scrolling visitor, I want compact navigation to appear after leaving the top, so that navigation remains accessible without dominating the page.
12. As a keyboard visitor, I want header changes to preserve my focused control, so that scrolling does not interrupt navigation.
13. As a visitor, I want the role tracks to respond continuously to scroll direction and stop when I stop, so that movement feels connected to my input.
14. As a visitor, I want landscape capsules and repeated role text to remain composed during resizing, so that the section has no gaps or broken overflow.
15. As a screen-reader visitor, I want each role announced once, so that decorative repetitions do not obscure the content.
16. As a hiring manager, I want to scan the four projects and their categories in the specified order, so that I can choose relevant work quickly.
17. As a pointer visitor, I want a project image to expand inline between its name and category, so that I can preview the work while retaining the index layout.
18. As a visitor moving quickly between projects, I want the latest row to respond without flicker or queued animations, so that I remain in control.
19. As a keyboard visitor, I want one focusable link per project row and a preview on focus, so that I can inspect and open work efficiently.
20. As a keyboard visitor also using a pointer, I want focus to determine the active project preview, so that passive hover does not override my selection.
21. As a touch visitor, I want visible project thumbnails and single-tap navigation, so that I do not need a hover-equivalent preview step.
22. As a pointer visitor, I want restrained magnetic feedback on clickable controls, so that actions respond consistently to my input.
23. As a visitor, I want clickable areas to remain stable while their contents move, so that my click activates the expected destination immediately.
24. As a visitor using keyboard, touch, or forced colors, I want stable controls with clear focus or press feedback, so that pointer enhancements are unnecessary.
25. As a pointer visitor inspecting images, I want a following cursor that visibly inverts image colors, so that image interaction has the specified visual feedback.
26. As a visitor, I want the cursor arrow only on clickable imagery, so that decorative photos do not imply an action.
27. As a visitor selecting text or leaving the window, I want appropriate native cursor behavior, so that the decorative cursor does not interfere.
28. As a visitor, I want the compact menu to reveal navigation through staggered stairs panels, so that the transition matches the approved interaction direction.
29. As a pointer visitor, I want menu links to reveal their repeating label/image treatment on hover and restore their static labels on exit, so that feedback remains readable.
30. As a visitor, I want to close or reverse the menu during opening, so that animations follow my latest intent.
31. As a keyboard visitor, I want an accessible menu with contained focus and Escape dismissal, so that I can operate it without a pointer.
32. As a visitor dismissing the menu, I want my previous scroll position and trigger focus restored, so that I can resume browsing.
33. As a visitor choosing a menu destination, I want navigation to work before the transition finishes, so that animation does not block my action.
34. As a visitor opening a project, I want its preview to connect visually to the case-study hero, so that the destination preserves context.
35. As a visitor opening a direct URL, new tab, or touch destination, I want the case study to load without a source preview, so that every entry path works.
36. As a visitor using modified clicks, I want normal browser link behavior, so that I can open projects in another tab.
37. As a visitor returning from a case study, I want the selected-work scroll position restored, so that I can continue comparing projects.
38. As a keyboard or screen-reader visitor changing pages, I want focus to reach meaningful destination content, so that the new page is understandable.
39. As a recruiter, I want case studies to lead with problems, contributions, and design decisions, so that I can assess product design judgment before examining implementation details.
40. As a hiring manager, I want each case study to identify the problem, audience, role, collaborators, status, and available links, so that I can assess Alan's actual contribution.
41. As a hiring manager, I want Aurelia and PawFriend identified as self-initiated concepts, so that their scope is represented accurately.
42. As a design lead, I want examples of starting states, actions, feedback, results, and interruptions, so that I can evaluate interaction decisions.
43. As an engineering lead, I want actual implementation or recording evidence where available, so that I can assess how designs behave in practice.
44. As a hiring manager, I want later explorations distinguished from original project contributions, so that I can assess the evidence accurately.
45. As a visitor, I want concise case studies whose depth reflects useful evidence, so that I can understand each project without repetitive filler.
46. As a desktop visitor, I want vertical scrolling to advance a short horizontal media sequence, so that I can examine project workflows in order.
47. As a visitor, I want media progress and a working skip link, so that I can control how much of the sequence I explore.
48. As a keyboard visitor, I want focused content in the media sequence to remain reachable and visible, so that horizontal presentation does not trap navigation.
49. As a mobile or reduced-motion visitor, I want the same project media stacked vertically, so that I receive the full case study without spatial scrolling effects.
50. As a visitor reading detailed research or implementation explanations, I want normal vertical flow, so that longer text remains comfortable to read.
51. As a visitor, I want a brief homepage introduction and a separate About page, so that I can choose how much background to read.
52. As a visitor, I want clear, brief copy with consistent terminology and meaningful action labels, so that I can understand the work and navigate without guesswork.
53. As a recruiter or prospective collaborator, I want a clear email action and a secondary LinkedIn option with verified destinations, so that I can reach Alan reliably.
54. As a recruiter, I want working professional profile and resume links, so that I can verify background and retain a current resume.
55. As a reduced-motion visitor, I want preferences respected at load and when changed during the session, so that the site adapts without losing content or actions.
56. As a visitor on a narrow screen, I want essential text and controls to fit without horizontal page overflow, so that I can browse comfortably.
57. As a visitor using assistive technology, I want semantic controls, useful alternatives, visible focus, and sufficient contrast, so that the portfolio is usable independently of visual effects.
58. As a visitor on a slower connection, I want sized and optimized media with ready hover previews, so that loading does not produce blank previews or disruptive shifts.
59. As a visitor following an invalid URL, I want a useful not-found page, so that I can recover and continue browsing.
60. As someone sharing a project, I want descriptive titles and social previews, so that the link communicates its destination clearly.
61. As Alan, I want unsupported metrics and invented claims excluded, so that the portfolio accurately represents my work.
62. As Alan, I want recordings and documented test coverage, so that I can judge actual behavior before accepting the build.

## Implementation Decisions

### Positioning, writing, and evidence

- Product Designer is the primary hiring focus. Alan is open to Design Engineer roles while learning; do not imply established Design Engineer employment history. Use the glossary's design-to-development bridge concept when explaining how he connects design intent, technical feasibility, and implementation guidance.
- Apply better-writing to all website copywriting, including case-study prose, About, navigation, contact, controls, and recovery messages. Keep language clear and brief, terminology consistent, link labels meaningful, and sentence case the default. Preserve deliberate approved identity copy.
- The hero phrase "Design • Engineer" is exact. About and contact text identified as starting copy remains editable within the agreed positioning; it must accurately distinguish current employment from career direction.
- Lead each case study with the user problem, Alan's actual contribution, and consequential design decisions; follow with interaction evidence and implementation considerations. Explain feasibility, constraints, and translation of design intent into implementation where supported by actual work.
- Keep all four case studies complete with their required introduction and media sequence, but vary depth with available evidence. Media panels explain workflows and decisions; longer sections must add useful evidence or reasoning rather than equalize page lengths.
- Allow selectively built interaction demonstrations for existing projects, clearly labelled as later explorations and separated from original contributions. They do not establish historical implementation, production use, or testing results.
- Keep the About page concise: current work, approach to product problems, developer collaboration, current learning, and resume access, with specific verified examples where available.
- Invite employment and collaboration through the contact section. The primary action opens an email draft to Alan's verified address; LinkedIn remains a secondary contact option.

### Application and content structure

- Use React, TypeScript, and Next.js because the workspace has no existing application stack. Keep portfolio content static and isolate browser interactions in client components. No database or backend application is required.
- Provide Home at `/`, Work at `/#work`, About at `/about`, Contact at `/#contact`, and case studies at `/work/[slug]`. Resume leads to a verified viewable or downloadable PDF. Support direct route loads and a useful not-found destination.
- Separate responsibilities for the site shell/header, navigation overlay, input and motion preferences, magnetic control, cursor, role tracks, project gallery, route transition, case-study media sequence, and verified portfolio content. These are responsibility boundaries, not a requirement for separate packages.
- Keep project content structured consistently: identity, category, slug, preview and hero media, audience/problem, actual contribution, collaborators, concept/client status, evidence, available live/source links, and media panels. Keep unknown facts unasserted until verified.
- Order selected work as Aurelia/Hospitality/aurelia, Paylecta/Finance/paylecta, PawFriend/Pet adoption/pawfriend, and Munchpal/Food sharing/munchpal.
- Treat Aurelia and PawFriend as self-initiated concepts. Verify the remaining status and contribution descriptions before release.

### Composition and visual system

- Use Halyard Display Variable throughout, including controls and role bands. Use a neutral sans-serif fallback during loading. Preserve the AS graphic and text embedded in authentic project screenshots. Start with body weight 400, controls/metadata 500, and display 500 or 600.
- Use fluid type without distorted letterforms. Recalculate text and track measurements after font readiness and resize.
- Start with background #F6F5F1, primary text #20221F, secondary text #62625E, accent #245BFF, and dividers #DDDDD5. Check actual contrast. Begin with 64–80px desktop gutters at 1440px and adapt to smaller screens.
- Preserve the asymmetric hero, inset rectangular portrait, separate large name, sparse blue corner detail, and cobalt ID square beside "Based in Indonesia". Hero supporting copy is exactly "Design • Engineer". This identity phrase does not assert an employment title or replace the Product Designer hiring priority. Links are usable immediately, including during an optional short entrance.
- Place Design / Build / Refine immediately after the hero. Its three oversized tracks read Product Designer, Design Engineer, and Interaction Designer, with landscape photographs in horizontal capsules. These images are decorative.
- Use a typographic project index with fine separators, intact project names, inline previews, categories, and northeast arrows. Keep homepage metadata brief; add a compact project-status line only if clarity requires it.
- Use a compact homepage About label, corner detail, one short introduction, and "More about me". Starting introduction copy is "UI/UX Designer at an IT consulting company. Bringing design and frontend craft closer together." Keep the separate About page within the agreed content scope; omit a long autobiography and skills-rating charts.
- Use a straight-edged cobalt footer with off-white text and "Let's work together." as starting copy, inviting employment and collaboration. Pair the contact text with an unboxed diagonal arrow as one action opening an email draft to Alan's verified address. Keep LinkedIn as a secondary contact option. Include verified LinkedIn, GitHub, Behance, and Resume destinations, AS mark, and copyright.

### Required interactions

- **I-01, role parallax:** Derive horizontal travel from section scroll progress, alternate adjacent track direction, and use staggered starting offsets. Stop and reverse with scroll input. Repeat enough content to cover the viewport throughout travel, clip decorative overflow locally, and expose one semantic copy of each role. Recalculate after resize/font loading. Reduced motion shows stationary labels and images.
- **I-02, inline gallery:** On fine-pointer hover or keyboard focus, expand the image container from width zero to auto around explicitly sized responsive inner media. Move surrounding text apart, reserve row height, preserve crop, and keep the row's semantic hit area stationary. Each row is one anchor and keyboard stop. Focus wins over hover; leaving resets hover unless focus remains. Retarget running animation on rapid changes. Touch uses visible compact stacked thumbnails and one-tap entry; reduced motion uses immediate or visible previews.
- **I-03, magnetism:** Apply a reusable behavior to every pointer-accessible action, including brand, navigation, menu controls/links, project links, About, contact, professional links, resume, and case-study actions. Measure against a stable target; move only the visible child. Give project title/arrow groups restrained movement with separate wrappers for gallery and route effects. Avoid nested double application. All actions remain immediately clickable at actual pointer coordinates. Touch, keyboard, reduced motion, and forced colors use stable equivalent feedback. Maintain an action inventory to check complete coverage.
- **I-04, cursor:** Use a small smoothed following dot on compatible fine pointers. Over images, show an actual negative-color disc through verified compositing, such as a light difference-blend layer. Add an arrow only over clickable image targets; separate the arrow layer if needed for legibility. Keep the overlay decorative and input-transparent. Enable native-cursor hiding only once replacement is ready. Restore native meaning for text selection; hide/reset on window exit, touch, reduced motion, failure, and route/menu state changes. Use real pointer input independently of magnetic output.
- **I-05, header:** Show brand and full navigation at the top on every screen size, using two rows on narrow screens if needed. Start compact mode above 96px and restore full mode below 48px, with centrally stored tunable thresholds. Avoid height jumps and duplicate interactive controls; hidden controls leave the tab order. Defer mode switches while header focus remains and freeze switching while the menu is open. Handle restored scroll positions and direct loads.
- **I-06, stairs menu:** Begin with five staggered vertical panels revealing large primary links and smaller professional links. Use the approved palette and font. Hovered menu rows reveal restrained moving repeated label/image strips; exit restores static labels. Hide repetitions from assistive technology and stop repeating movement on exit or close. Explicitly model closed, opening, open, and closing; latest intent wins. Keep close usable during opening, coordinate route selection with closure, and preserve modified clicks. Use an accessible labelled dialog/navigation pattern, visible focus, focus containment, background inertness, Escape dismissal, saved-scroll restoration, and appropriate trigger/destination focus. Reduced motion uses a static equivalent and immediate state changes.
- **I-07, project entry/return:** Connect the gallery preview to the destination hero through a short shared-image expansion with stable crop and dimensions and a settling title. Provide entry without source media for touch, direct loads, and new tabs. Navigation succeeds independently of animation. Preserve modified clicks, browser history, destination focus, and the selected-work return position. Menu navigation coordinates its own close rather than stacking a complete stairs transition with a complete project transition.
- **I-08, project media:** Follow a concise vertical introduction with three or four desktop media panels advanced horizontally by ordinary vertical scrolling. Each panel demonstrates a workflow, interaction, or decision with brief accompanying text. Include progress and a working skip action. Keep focused content reachable; recalculate travel/pinning after resize or media changes and clean up on navigation. Stack the same content for narrow screens/reduced motion; resume normal vertical flow for longer explanations. Implementation must not depend on paid reference source access.

### Motion, input, and performance

- Use Motion for React for gallery width, parallax, stairs, and magnetic behavior. GSAP/ScrollTrigger is optional for horizontal media if it materially simplifies the work. Give each element's transform a single animation owner.
- Keep native scrolling as the baseline. Add Lenis only if measured behavior improves without breaking anchors, keyboard scrolling, touch, history restoration, or reduced motion.
- Share timing, easing, magnetic strength, cursor smoothing, and scroll-distance tokens. Starting durations: press/color 120–180ms; header 200–300ms; gallery 350–450ms; cursor size 160–220ms; stairs including stagger 450–650ms; project entrance 450–600ms. Start magnetic displacement at 3–6px for text and up to 10–16px for large controls. These values are tunable, not copied demo measurements.
- Prefer transform/opacity except the required gallery width animation, which must be isolated and profiled. Avoid slow settling or excessive overshoot. Use pointer events, animation values, or animation frames without rerendering the entire page per pointer movement.
- Separate navigation state, active gallery state, cursor mode, and magnetic offsets. Menu interaction owns pointer feedback when open; keyboard focus owns active gallery selection; reduced motion disables spatial enhancements while preserving actions.
- Respond to reduced-motion preference both initially and during the session. Disable magnetic displacement, cursor following, spatial role parallax, width tweening, and elaborate menu/route movement while maintaining full content and immediate feedback.
- Invalidate measured bounds when layout changes. Clean up observers, listeners, frames, and scroll triggers; pause unnecessary work while the page is hidden.
- Optimize media and reserve aspect ratios. Load hero media deliberately, defer below-the-fold content, keep hover previews ready, and avoid loading all project videos on the homepage. Provide page titles, metadata, social previews, and favicon.

### Release dependencies and delivery

- Read the PRD's linked portfolio sources before writing factual case-study copy. Recheck Paylecta metrics and testimonial/persona provenance, Munchpal task-time/completion figures, and resume accuracy. Remove any AI-directed instruction or keyword block from the release resume if found. Omit unsupported outcomes, testing claims, production usage, and accessibility claims.
- Release requires the original AS mark, real portrait, authentic project crops/recordings, rights-cleared landscape photos, current resume, verified contact/profile links, and evidence for claimed outcomes. A local photo filename alone does not establish release suitability. Clearly mark any development substitutes; remove placeholders before release.
- First inspect assets, confirm font/tokens and interaction states, and build the minimal responsive composition. Complete one end-to-end path through full/compact header, stairs menu, one magnetic gallery row, inversion cursor, and a real case-study route. Add role parallax and test combined behavior before expanding to all projects. Then finish media sequences, remaining content, About, and contact.

## Testing Decisions

- Use the running website in a real browser as the primary testing boundary, as approved by Alan. Use Playwright to exercise routes and observable user journeys. There are no existing tests or application-level testing conventions to reuse.
- Good tests assert visitor-visible behavior, destinations, focus, scroll position, content availability, and stable hit areas. Avoid assertions about component internals, hook structure, private animation values, or exact intermediate animation frames. Use observable conditions rather than arbitrary sleeps and allow sensible geometric tolerances.
- Exercise the header/menu, gallery, navigation, role parallax, project media, and preference fallbacks through this same boundary rather than creating a separate unit-test seam for each effect.
- Verify header behavior at the top, across both thresholds, while focused, after refreshed/restored scroll positions, and after menu dismissal. Check hidden controls cannot receive focus and switching causes no layout jump.
- Interrupt menu opening with Escape; rapidly toggle; select a route before opening finishes; resize while open; and navigate Back. Check latest intent, reachable close, contained/returned focus, background inertness, restored scroll, stopped repeating effects, and absence of residual overlays or locks.
- Enter gallery rows at either edge, cross children, traverse quickly, leave mid-expansion, and combine hover with keyboard focus. Verify actual inline growth and neighboring text movement, stable row height/hit areas, one anchor per row, correct focus precedence, and immediate navigation during movement. Check one-tap touch entry and ready previews.
- Verify all action categories from the clickable inventory remain clickable during magnetism. Check cursor behavior over light/dark image areas, clickable/decorative images, text selection, fast target changes, window exit/reentry, and route/menu transitions. Use manual visual review for inversion, legibility, spring restraint, and cursor feel.
- Test slow/fast/reverse/stopped scrolling for role tracks; resize and font readiness must not create gaps, clipped essential content, autonomous travel, or page-level overflow.
- Exercise normal project entry, missing-source fallback, direct URL loads, modified/new-tab clicks, Back/Forward, destination focus, and return scroll position. Navigation must still succeed if an enhancement fails.
- Test desktop horizontal media progress, skip behavior, visible/reachable focus, resizing, media load changes, and cleanup after navigation. Confirm equivalent stacked content on narrow screens and reduced motion.
- Validate 390px, 768px, and 1440px, with a 320px overflow check and intermediate widths near composition changes. Check name, role, navigation, work, and contact remain readable and usable.
- Check semantic controls, sensible tab order, useful image alternatives, one semantic copy of decorative repetitions, focus visibility, contrast, comfortable targets, touch, and forced-colors control fallback. Verify reduced motion both at initial load and after an in-session preference change.
- Run type checks, lint, production build, and targeted browser tests. Resolve relevant runtime console errors. Record performance measurements with conditions rather than asserting unmeasured scores. Report tested browsers/devices and coverage gaps; emulation does not imply physical-device testing.
- Record short real-browser demonstrations of header/menu, gallery/cursor/magnetism, role parallax, and one complete case-study journey. Review composition, typography, actual negative-color effect, image crop continuity, and motion with Alan. Screenshots alone cannot establish acceptance.
- Audit release content for verified links, a working email action and secondary LinkedIn destination, real assets, concept labels, contribution accuracy, supported outcomes, and clear attribution of later explorations. Check Product Designer hiring priority, the exact "Design • Engineer" hero phrase, agreed case-study hierarchy, concise About scope, and application of better-writing throughout. The build is complete only when the PRD acceptance checklist passes and the result has been visually reviewed.

## Out of Scope

- Reopening the approved visual direction or substituting generic fades for required interaction mechanisms.
- Transaction-widget hero, hero CTA or pill button, long loading introduction, standalone "In the details" demonstration, Experiments, additional marketing sections, second homepage portrait, or long homepage biography.
- Curved menu, curved charcoal footer, serif accent typography, Inter substitution, or copying the Dennis Snellenberg composition as a package.
- Autoplay role marquee, permanently expanded Aurelia row, desktop full-width preview cards below titles, or two-tap touch project navigation.
- Invented city, coordinates, availability, local time, email/profile destinations, collaborators, results, or production/testing claims.
- Database, authentication, CMS, blog, production booking service, or dependence on paid tutorial source code.

## Further Notes

- The workspace contains the PRD, a local photo file, glossary, alignment notes, and agent workflow configuration. There is no application, dependency manifest, or existing test suite. This specification describes the full implementation; publishing it does not build the application, decompose tickets, or deploy the site.
- This revision synthesizes the confirmed session into the existing tracker spec. The approved real-browser testing boundary remains unchanged; no additional testing boundary is proposed.
- Publication to the configured issue tracker means saving this local Markdown spec. The ready-for-agent status indicates that implementation can begin; it does not assert that release assets are already verified or that the site has passed acceptance.
- The approved composition image, font delivery, original AS asset, resume, contact destinations, project evidence, and landscape asset rights still require inspection or verification. This synthesis has not verified the external project sources or inspected the local photo. The local photo's presence alone does not establish its suitability.
- Verify existing source material before asking Alan to repeat facts. If a required asset or fact remains unavailable, identify the specific missing input and continue independent implementation work. Clearly marked development substitutes do not satisfy release acceptance, and missing evidence does not authorize dropping a project or inventing results.
- The PRD's links to the portfolio folder, Behance case studies, Aurelia, and PawFriend identify the source material to inspect during content preparation. The reference-image composition must also be inspected when available; written requirements win in a conflict.
- The PRD's Text Parallax, Image Slide Project Gallery, Magnetic Button, Sliding Stairs Menu, and Horizontal Section references define the required mechanisms. They do not override Alan's typography, identity, composition, sparse copy, accessibility requirements, or interaction pass conditions.
- No application tests have been run for this publication because there is no application yet. The testing decisions above are requirements for implementation, not claims of completed verification.
