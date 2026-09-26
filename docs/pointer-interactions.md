# Pointer interactions

Ticket 05 implements I-03 (magnetic feedback) and I-04 (image-inverting cursor). `PointerEnhancements` consumes real pointer coordinates once. Each `data-magnet` marks a stationary link/button; only its `data-magnet-part` children move. Keyboard focus clears movement immediately. All links keep native activation, including clicks while the spring or gallery width is changing.

## Current action inventory

| Action | Routes / surface | Maximum displacement | Moving visual |
| --- | --- | --- | --- |
| Skip to content | Shared header | 5px | Label; keyboard focus stays still |
| Brand / home | Shared header and footer | 5px | Logo and name |
| Work, About, Contact | Desktop primary navigation | 5px | Label |
| Full and compact Menu | Shared header | 12px | Label and icon |
| Close / Reopen menu | Menu | 12px | Label and icon |
| Work, About, Contact | Menu | 5px | Static label, inner marquee wrapper, arrow |
| Professional profiles | Menu and footer | 5px | Label and menu arrow |
| Aurelia project row | Homepage gallery | 6px | Title and arrow; preview width has its own wrapper |
| More about me | Homepage | 5px | Label and arrow |
| Contact heading | Shared footer | 12px | Heading and arrow |
| Contact email | Shared footer | 5px | Address |
| Back to selected work (top and bottom) | Aurelia case study | 5px | Label and arrow |
| View the live Aurelia concept | Aurelia case study | 5px | Label and arrow |
| Skip to implementation notes | Aurelia media toolbar | 5px | Label and arrow |
| Open filters/details/request screenshot | Aurelia media captions | 5px | Label and arrow |
| Open workflow recording fallback | Aurelia recording | 5px | Label |
| Video playback controls | Aurelia recording | None | Native browser controls |
| Resume | Header, menu, footer | None | Unavailable label, `aria-disabled`; no link until a current PDF exists |
| Paylecta, PawFriend, MunchPal | Homepage gallery | None | Static project rows until their routes exist |

No semantic action contains another magnetic target. The menu owns feedback while its overlay is present. Its marquee travel and magnetic movement use separate nested wrappers. Decorative and unavailable content is excluded from the action system.

## Cursor and lifecycle

The cursor is `aria-hidden` and `pointer-events: none`. Its white disc uses `mix-blend-mode: difference`; an independent outlined arrow remains readable on actionable images. Portrait and case-study hero imagery have no arrow. Brand logos and the Aurelia preview are images inside links and receive the arrow.

Enhancement requires a fine hovering pointer, normal motion preference, normal colors, ResizeObserver, and supported difference blending. Native cursor hiding is enabled only after the first frame positions and reveals the replacement. Closing and reopening the menu clear feedback immediately while the overlay continues to own pointer input. Text contexts and selection restore the native cursor. Menu/route changes, blur, window exit, touch input, preference changes, and hidden tabs clear springs and pending cursor frames. Layout changes, font completion, scroll, and resize recheck the stationary target at the same real pointer position. Effect cleanup destroys Motion values and removes listeners/observers.

## Verification evidence

Chromium at 1440 × 900, device scale 1, on 26 September 2026:

- Light portrait pixel: original RGB `(246, 245, 241)`, cursor RGB `(9, 10, 14)`.
- Dark portrait pixel: original RGB `(69, 35, 16)`, cursor RGB `(186, 220, 239)`.
- Each original/cursor channel pair sums to 255, confirming negative-color compositing on both areas. Screenshot inspection confirms the actionable gallery arrow and arrow-free portrait.
- Browser checks cover fixed hit bounds, direct coordinate clicks during movement, keyboard focus precedence, fast target changes, menu/route resets, selection, exit/reentry, touch, reduced motion, forced colors, and unsupported blending.

[Combined gallery, cursor, menu, and navigation recording](../.scratch/portfolio-halyard/demos/05-gallery-cursor-magnetism.webm)

This evidence covers Chromium and the current fallback font. Repeat visual checks when Halyard delivery is available; other browser engines remain part of release readiness.
