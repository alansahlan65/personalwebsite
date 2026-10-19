"use client";

import { memo, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { HandWaving, ChatsCircle, Layout, CursorClick, BookmarkSimple, Check } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { ControlVisual } from "./control-visual";
import { useMotionPreference } from "./use-motion-preference";
import styles from "./about-play.module.css";

const SKETCHES = {
  research: { label: "user research", title: "Understand the problem.", note: "Find out what people need.", icon: ChatsCircle },
  wireframe: { label: "wireframing", title: "Work out the structure.", note: "Map the content and steps.", icon: Layout },
  prototype: { label: "prototyping", title: "Try the interaction.", note: "Test how the screens work together.", icon: CursorClick },
} as const;

export const AboutSketch = memo(function AboutSketch({ kind }: { kind: keyof typeof SKETCHES }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [left, setLeft] = useState(0);
  const anchor = useRef<HTMLSpanElement>(null);
  const preview = useRef<HTMLSpanElement>(null);
  const previewContent = useRef<HTMLSpanElement>(null);
  const id = useId();
  const sketch = SKETCHES[kind];
  const Icon = sketch.icon;
  function show() {
    const bounds = anchor.current?.getBoundingClientRect();
    if (bounds) {
      const width = Math.min(260, window.innerWidth - 48);
      const left = Math.max(24, Math.min(bounds.left, window.innerWidth - width - 24));
      setLeft(left - bounds.left);
    }
    setOpen(true);
  }
  useLayoutEffect(() => {
    if (!open || !preview.current) return;
    const panel = preview.current;
    function place() {
      const bounds = anchor.current?.getBoundingClientRect();
      if (!bounds) return;
      const rail = document.querySelector(".compact-menu-rail");
      const floor = (rail && (scrollY > 96 || getComputedStyle(rail).visibility === "visible") ? rail.getBoundingClientRect().bottom : 0) + 16;
      panel.style.setProperty("--preview-available-height", `${Math.max(0, innerHeight - floor - 16)}px`);
      const height = panel.offsetHeight;
      const below = innerHeight - bounds.bottom - 26;
      const above = below < height && bounds.top - floor - 10 > below;
      const top = Math.max(floor, Math.min(innerHeight - height - 16, above ? bounds.top - height - 10 : bounds.bottom + 10));
      panel.style.top = `${top - bounds.top}px`;
      panel.toggleAttribute("data-above", above);
    }
    place();
    const observer = new ResizeObserver(place);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [open, left]);
  useEffect(() => {
    if (!open) return;
    const close = () => { setOpen(false); setPinned(false); };
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !anchor.current?.contains(event.target)) close(); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("resize", close);
    };
  }, [open]);
  return <span className={styles.sketchAnchor} ref={anchor}
    onPointerEnter={event => { if (event.pointerType !== "touch") show(); }}
    onPointerLeave={() => { if (!pinned && !anchor.current?.contains(document.activeElement)) setOpen(false); }}
    onKeyDown={event => {
      const panel = previewContent.current;
      if (!open || !panel || panel.scrollHeight <= panel.clientHeight) return;
      const step = event.key === "ArrowDown" ? 40 : event.key === "ArrowUp" ? -40 : event.key === "PageDown" ? panel.clientHeight : event.key === "PageUp" ? -panel.clientHeight : 0;
      if (step) { event.preventDefault(); panel.scrollBy({ top: step }); }
    }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setPinned(false); } }}>
    <button type="button" className={styles.inlineWord} data-pointer-feedback="local" aria-expanded={open} aria-controls={id} aria-describedby={open ? id : undefined}
      onFocus={show} onClick={() => { if (pinned) setOpen(false); else show(); setPinned(!pinned); }}>{sketch.label}</button>
    <span id={id} ref={preview} role="tooltip" className={styles.sketchPreview} hidden={!open} style={{ left }}>
      <span ref={previewContent} className={styles.sketchContent} data-preview-content=""><Icon size={30} weight="regular" aria-hidden /><span className={styles.sketchTitle}>{sketch.title}</span><span className={styles.sketchNote}>{sketch.note}</span></span>
    </span>
  </span>;
});

export const AboutPortrait = memo(function AboutPortrait({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  return <div className={styles.portrait} data-greeting={open || undefined}>
    <div className={`portrait-frame ${styles.photo}`}>{children}</div>
    <div className={styles.hello}>
      <button type="button" className={styles.helloButton} data-pointer-feedback="local" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <ControlVisual><span className={styles.hand}><HandWaving size={22} weight="regular" aria-hidden /></span><span>{open ? "Hello back!" : "Say hello"}</span></ControlVisual>
      </button>
      <span className={styles.greeting} id={id} role="status">{open ? "Hey! Thanks for stopping by." : ""}</span>
      <noscript><style>{`.${styles.hello} { display: none; }`}</style></noscript>
    </div>
  </div>;
});

export function AboutExperiment() {
  const [withMotion, setWithMotion] = useState(true);
  const [saved, setSaved] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const reduced = useMotionPreference();
  const enabled = withMotion && !reduced;
  const hint = useId();
  const Icon = saved ? Check : BookmarkSimple;
  return <div className={styles.experiment} role="group" aria-label="Button motion comparison" data-experiment="" data-motion={enabled ? "on" : "off"}>
    <div className={styles.experimentControls}>
      <h3>Feel the difference.</h3>
      <div className={styles.motionModes} role="group" aria-label="Button feedback">
        <button type="button" data-pointer-feedback="local" aria-pressed={!withMotion} onClick={() => setWithMotion(false)}>Static</button>
        <button type="button" data-pointer-feedback="local" aria-pressed={withMotion} onClick={() => setWithMotion(true)}>Motion</button>
      </div>
    </div>
    <button type="button" className={styles.saveButton} aria-pressed={saved} aria-describedby={hint} data-saved={saved || undefined}
      data-pointer-feedback="local" data-magnet={enabled ? "control" : undefined}
      onClick={event => {
        setKeyboard(event.detail === 0);
        setSaved(!saved);
        setAnnouncement(saved ? "Favorite removed from this demo." : "Favorite saved in this demo.");
      }}>
      <ControlVisual className={styles.savePaint} motionEnabled={enabled} pressScale={.96}>
        <span className={styles.saveIcon} data-magnet-part aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.span key={saved ? "saved" : "save"} initial={enabled && !keyboard ? { opacity: 0, scale: .25, filter: "blur(4px)" } : false}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={enabled && !keyboard ? { opacity: 0, scale: .25, filter: "blur(4px)" } : { opacity: 0 }}
              transition={{ type: "spring", duration: enabled && !keyboard ? .3 : 0, bounce: 0 }}>
              <Icon size={28} weight="regular" />
            </motion.span>
          </AnimatePresence>
        </span>
        <span data-magnet-part>{saved ? "Saved" : "Save a favorite"}</span>
      </ControlVisual>
    </button>
    <span id={hint} className={styles.srOnly}>{reduced ? "Button experiment. Motion is off to match your device settings." : "Button experiment. Changes stay on this page."}</span>
    <span className={styles.srOnly} role="status">{announcement}</span>
    <noscript><style>{`[data-experiment] { display: none; }`}</style></noscript>
  </div>;
}
