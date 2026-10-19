"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./about-play.module.css";

const SKETCHES = {
  research: { label: "user research", title: "Start with a question.", note: "Understand the people before drawing the screens." },
  wireframe: { label: "wireframing", title: "Make room for the idea.", note: "Work out the structure before getting into the details." },
  prototype: { label: "prototyping", title: "Give it a little life.", note: "Try how an interface behaves, not just how it looks." },
} as const;

function Sketch({ kind }: { kind: keyof typeof SKETCHES }) {
  return (
    <svg className={styles.sketch} viewBox="0 0 240 94" fill="none" aria-hidden="true">
      {kind === "research" ? <>
        <path d="M30 18h116v43H76L60 76V61H30z" />
        <path d="M51 33h54m-54 13h75" />
        <circle cx="187" cy="31" r="12" />
        <path d="M166 72v-9a21 21 0 0 1 42 0v9" />
        <circle className={styles.sketchAccent} cx="127" cy="34" r="4" />
      </> : kind === "wireframe" ? <>
        <rect x="35" y="9" width="170" height="77" rx="3" />
        <path d="M35 25h170m-153-8h4m6 0h4m6 0h4" />
        <rect x="48" y="36" width="53" height="37" rx="2" />
        <path d="m48 36 53 37m0-37L48 73m67-32h73m-73 12h51" />
        <rect className={styles.sketchAccent} x="115" y="64" width="39" height="9" rx="2" />
      </> : <>
        <rect x="45" y="12" width="55" height="70" rx="5" />
        <path d="M54 24h37m-37 11h26m-26 9h32m22 3h34m-8-8 8 8-8 8" />
        <rect x="157" y="12" width="45" height="70" rx="5" />
        <rect className={styles.sketchAccent} x="53" y="57" width="39" height="14" rx="3" />
        <path className={styles.sketchAccent} d="m167 44 8 8 16-20" />
        <path d="m79 68 1 18 5-5 5 7 4-2-5-7 8-1z" fill="var(--canvas)" />
      </>}
    </svg>
  );
}

export function AboutSketch({ kind }: { kind: keyof typeof SKETCHES }) {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState({ left: 0, above: false });
  const anchor = useRef<HTMLSpanElement>(null);
  const id = useId();
  const sketch = SKETCHES[kind];

  function show() {
    const bounds = anchor.current?.getBoundingClientRect();
    if (bounds) {
      const width = Math.min(240, window.innerWidth - 48);
      const left = Math.max(24, Math.min(bounds.left, window.innerWidth - width - 24));
      setPosition({ left: left - bounds.left, above: bounds.bottom + 210 > window.innerHeight && bounds.top > 210 });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const close = () => { setOpen(false); setPinned(false); };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !anchor.current?.contains(event.target)) close();
    };
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

  return (
    <span className={styles.sketchAnchor} ref={anchor}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") show(); }}
      onPointerLeave={() => { if (!pinned) setOpen(false); }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setPinned(false); }
      }}>
      <button type="button" className={styles.inlineWord} data-pointer-feedback="local"
        aria-expanded={open} aria-controls={id} aria-describedby={open ? id : undefined}
        onFocus={show} onClick={() => {
          if (pinned) setOpen(false); else show();
          setPinned(!pinned);
        }}>{sketch.label}</button>
      <span id={id} role="tooltip" className={styles.sketchPreview} hidden={!open}
        data-above={position.above || undefined} style={{ left: position.left }}>
        <Sketch kind={kind} />
        <span className={styles.sketchTitle}>{sketch.title}</span>
        <span className={styles.sketchNote}>{sketch.note}</span>
      </span>
    </span>
  );
}

function Wave() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m8 13-3-4a1.5 1.5 0 0 1 2.4-1.8l2.6 3.5-2.4-6a1.4 1.4 0 0 1 2.6-1l2.5 6.1-1-6.6a1.4 1.4 0 0 1 2.8-.4l1 6.5.5-4.2a1.4 1.4 0 0 1 2.8.3l-.6 6 1.2-1.5a1.5 1.5 0 0 1 2.3 1.9l-3.5 5.7c-1.7 2.8-5.4 3.6-8.2 1.9L6.7 17A2.5 2.5 0 0 1 6 13.5l1-1.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 3 1 2m2 5H1m20-4 1-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function AboutPortrait({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={`portrait-frame ${styles.portrait}`} data-greeting={open || undefined}
      onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
      {children}
      <div className={styles.hello}>
        <span className={styles.greeting} id={id} hidden={!open}>Hey, I&apos;m Alan.<br />Thanks for stopping by!</span>
        <button type="button" className={styles.helloButton} data-pointer-feedback="local"
          aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
          <span className={styles.hand}><Wave /></span><span>{open ? "Hello back!" : "Say hello"}</span>
        </button>
        <span className={styles.srOnly} role="status">{open ? "Hey, I'm Alan. Thanks for stopping by!" : ""}</span>
      </div>
    </div>
  );
}

export function AboutExperiment() {
  const [pressed, setPressed] = useState(false);
  const [code, setCode] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const id = useId();
  return (
    <div className={styles.experiment} data-keyboard={keyboard || undefined}>
      <div className={styles.experimentHeader}>
        <span>A small experiment</span>
        <button type="button" className={styles.codeToggle} data-pointer-feedback="local"
          aria-expanded={code} aria-controls={id} onClick={() => setCode(!code)}>
          <span aria-hidden="true">{code ? "↔" : "</>"}</span>{code ? "Try it" : "Peek at the code"}
        </button>
      </div>
      <div className={styles.experimentBody}>
        <div className={styles.demo} hidden={code}>
          <span className={styles.demoButtonWrap}>
            <button type="button" className={styles.demoButton} data-pointer-feedback="local"
              aria-pressed={pressed} onClick={(event) => {
                setKeyboard(event.detail === 0);
                setPressed(!pressed);
              }}>
              <span className={styles.demoSymbol} aria-hidden="true">{pressed ? "✓" : "+"}</span>
              <span>{pressed ? "That feels better." : "Give it a click"}</span>
            </button>
            <span className={styles.sparks} data-active={pressed || undefined} aria-hidden="true">
              <i /><i /><i /><i />
            </span>
          </span>
          <span className={styles.demoNote}>{pressed ? "Small detail. A little more personality." : "A button can have a little personality, too."}</span>
        </div>
        <pre id={id} className={styles.code} hidden={!code}><code>{`.button:active {\n  transform: scale(0.97);\n}\n\n/* A little feedback goes a long way. */`}</code></pre>
      </div>
      <span className={styles.srOnly} role="status">{pressed ? "Button activated. Click again to reset the experiment." : ""}</span>
    </div>
  );
}
