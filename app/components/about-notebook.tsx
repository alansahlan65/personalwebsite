"use client";

import { memo, useEffect, useId, useRef, useState } from "react";
import { animate, motion, useDragControls, useMotionValue } from "motion/react";
import { Check, FilmSlate, GameController, Hourglass } from "@phosphor-icons/react";
import { useMotionPreference } from "./use-motion-preference";
import { CONTROL_SPRING, SLIDE_EASE } from "../lib/interaction-motion";
import { ControlVisual } from "./control-visual";
import styles from "./about-notebook.module.css";

const TRIVIA = [
  { question: "Marvel or DC?", clue: "Two universes. One impossible choice.", answer: "Both. I love Marvel and DC.", icon: FilmSlate },
  { question: "My kind of game night?", clue: "A sword, a saddle, and one more quest.", answer: "The Witcher 3 and Red Dead Redemption 2.", icon: GameController },
  { question: "What keeps me turning pages?", clue: "Big decisions. Wild plot twists. All of it happened.", answer: "History. I love reading it, too.", icon: Hourglass },
] as const;

const TriviaCard = memo(function TriviaCard({ cardIndex, index, still, reduced, select, discover }: { cardIndex: number; index: number; still: boolean; reduced: boolean; select: (next: number, keyboard: boolean) => void; discover: (card: number) => void }) {
  const [revealed, setRevealed] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const id = useId();
  const dragged = useRef(false);
  const cancelled = useRef(false);
  const dragging = useRef(false);
  const held = useRef(false);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const answer = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLElement>(null);
  const answerHeight = useMotionValue<number | string>("auto");
  const [oversized, setOversized] = useState(false);
  const oversizedValue = useRef(false);
  const [bounds, setBounds] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const rank = (cardIndex - index + TRIVIA.length) % TRIVIA.length;
  const active = rank === 0;
  const draggable = active && !reduced && !oversized;
  const trivia = TRIVIA[cardIndex];
  const Icon = trivia.icon;
  const transition = { duration: still || keyboard ? 0 : .25, ease: SLIDE_EASE };
  useEffect(() => {
    if (!active) return;
    const face = answer.current?.querySelector<HTMLElement>('[aria-hidden="false"]');
    if (!face) return;
    let stop: (() => void) | undefined;
    function fit(size: number) {
      size = Math.ceil(size);
      if (answerHeight.get() === size) return;
      stop?.();
      if (answerHeight.get() === "auto" || still || keyboard) answerHeight.set(size);
      else {
        const controls = animate(answerHeight, size, { duration: .22, ease: SLIDE_EASE });
        stop = () => controls.stop();
      }
    }
    fit(face.offsetHeight);
    const observer = new ResizeObserver(entries => {
      const size = entries[0]?.borderBoxSize[0]?.blockSize ?? entries[0]?.contentRect.height;
      if (size !== undefined) fit(Math.ceil(size));
    });
    observer.observe(face);
    return () => { observer.disconnect(); stop?.(); };
  }, [active, revealed, still, keyboard, answerHeight]);
  useEffect(() => {
    if (!active || !card.current) return;
    const node = card.current;
    function measure() {
      const header = Math.max(76, 4.75 * parseFloat(getComputedStyle(document.documentElement).fontSize));
      const available = (window.visualViewport?.height ?? innerHeight) - header - 48;
      const next = node.offsetHeight > available;
      if (next && (held.current || dragging.current)) { cancelled.current = true; held.current = false; dragging.current = false; dragControls.cancel(); x.set(0); y.set(0); }
      if (oversizedValue.current !== next) { oversizedValue.current = next; setOversized(next); }
    }
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [active, dragControls, x, y]);
  useEffect(() => {
    if (reduced) { dragControls.cancel(); held.current = false; dragging.current = false; x.set(0); y.set(0); }
  }, [reduced, dragControls, x, y]);
  useEffect(() => {
    function cancel(immediate = false) {
      if (!held.current && !dragging.current) return;
      cancelled.current = true;
      held.current = false;
      dragging.current = false;
      dragControls.cancel();
      if (immediate) { x.stop(); y.stop(); x.set(0); y.set(0); }
      else { animate(x, 0, CONTROL_SPRING); animate(y, 0, CONTROL_SPRING); }
    }
    const blur = () => cancel();
    const resized = () => cancel(true);
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") cancel(); };
    const hidden = () => { if (document.hidden) cancel(); };
    window.addEventListener("blur", blur);
    window.addEventListener("resize", resized);
    document.addEventListener("keydown", escape);
    document.addEventListener("visibilitychange", hidden);
    return () => {
      window.removeEventListener("blur", blur);
      window.removeEventListener("resize", resized);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [dragControls, x, y]);
  return <motion.article ref={card} className={styles.note} data-front={active || undefined} data-depth={rank} data-draggable={draggable || undefined} data-scroll={active && oversized || undefined} aria-hidden={!active} inert={!active}
    style={{ zIndex: TRIVIA.length - rank, x, y }} initial={false}
    animate={{ x: still ? 0 : rank * 3, y: still ? 0 : -rank * 7, rotate: still || active ? 0 : rank === 1 ? 3 : -4 }}
    transition={still ? { duration: 0 } : CONTROL_SPRING}
    drag={draggable} dragControls={dragControls} dragConstraints={bounds} dragElastic={0} dragMomentum={false} dragSnapToOrigin
    dragTransition={{ bounceStiffness: CONTROL_SPRING.stiffness, bounceDamping: CONTROL_SPRING.damping }}
    whileDrag={{ scale: 1.015 }}
    onPointerDownCapture={event => {
      if (!event.isPrimary) return;
      dragged.current = false;
      cancelled.current = false;
      if (!draggable) return;
      held.current = true;
      // Measure once per gesture. Keep the lifted card inside the viewport,
      // while allowing it to travel beyond every edge of its resting deck.
      const rect = event.currentTarget.getBoundingClientRect();
      const edge = 24;
      const railBottom = document.querySelector(".compact-menu-rail")?.getBoundingClientRect().bottom ?? 0;
      setBounds({ left: Math.min(0, edge - rect.left + x.get()), right: Math.max(0, innerWidth - edge - rect.right + x.get()), top: Math.min(0, railBottom + edge - rect.top + y.get()), bottom: Math.max(0, innerHeight - edge - rect.bottom + y.get()) });
    }}
    onPointerUpCapture={() => { held.current = false; }}
    onPointerCancelCapture={() => { held.current = false; cancelled.current = true; }}
    onDragStart={() => { if (!cancelled.current) { dragged.current = true; dragging.current = true; } }}
    onClickCapture={event => { if (event.detail !== 0 && dragged.current) { event.preventDefault(); event.stopPropagation(); } }}
    onDragEnd={(_, info) => {
      dragging.current = false;
      const sideways = Math.abs(info.offset.x) > Math.abs(info.offset.y);
      if (!cancelled.current && sideways && (Math.abs(info.offset.x) > 55 || Math.abs(info.velocity.x) > 500)) select((index + (info.offset.x < 0 ? 1 : TRIVIA.length - 1)) % TRIVIA.length, false);
    }}>
    <div className={styles.question}>
      <motion.span className={styles.questionIcon} aria-hidden initial={false} animate={{ rotate: revealed && !still && !keyboard ? -8 : 0, scale: revealed && !still && !keyboard ? 1.08 : 1 }} transition={still || keyboard ? { duration: 0 } : CONTROL_SPRING}><Icon size={24} weight={revealed ? "fill" : "regular"} /></motion.span>
      <h3>{trivia.question}</h3>
    </div>
    <motion.div className={styles.answer} id={id} ref={answer} style={{ height: answerHeight }}>
      <motion.div aria-hidden={revealed} initial={false} animate={{ transform: revealed ? "translateY(-100%)" : "translateY(0%)", opacity: revealed ? 0 : 1 }} transition={transition}><p>{trivia.clue}</p></motion.div>
      <motion.div aria-hidden={!revealed} initial={false} animate={{ transform: revealed ? "translateY(0%)" : "translateY(100%)", opacity: revealed ? 1 : 0 }} transition={transition}><p>{trivia.answer}</p></motion.div>
    </motion.div>
    <button type="button" className={styles.textButton} aria-expanded={revealed} aria-controls={id} data-pointer-feedback="local" onClick={event => { setKeyboard(event.detail === 0); if (!revealed) discover(cardIndex); setRevealed(value => !value); }}>
      <ControlVisual>{revealed ? "Hide answer" : "Reveal answer"}</ControlVisual>
    </button>
    <span className={styles.srOnly} role="status">{active && revealed ? trivia.answer : ""}</span>
  </motion.article>;
});

export const AboutNotebook = memo(function AboutNotebook() {
  const [index, setIndex] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [discovered, setDiscovered] = useState(0);
  const reduceMotion = useMotionPreference();
  const id = useId();
  const still = Boolean(reduceMotion || keyboard);
  function select(next: number, keyboardInput: boolean) { setKeyboard(keyboardInput); setIndex(next); }
  function discover(card: number) { setDiscovered(value => value | (1 << card)); }
  const found = TRIVIA.filter((_, card) => discovered & (1 << card)).length;
  return <div className={styles.notebook} role="group" aria-label="Little trivia about Alan" data-notebook="" data-still={still || undefined}>
    <div data-trivia-interactive="">
      <div className={styles.deck} id={id}>
        {TRIVIA.map((trivia, i) => <TriviaCard key={trivia.question} cardIndex={i} index={index} still={still} reduced={Boolean(reduceMotion)} select={select} discover={discover} />)}
      </div>
      <div className={styles.deckFooter}>
        <div className={styles.progress}><span className={styles.hint}>{`${index + 1} of ${TRIVIA.length}`}</span><span className={styles.discoveries} role="img" aria-label={`${found} of ${TRIVIA.length} stories discovered`}>{TRIVIA.map((trivia, card) => <span key={trivia.question} data-discovered={discovered & (1 << card) || undefined} aria-hidden>{discovered & (1 << card) ? <Check size={11} weight="bold" /> : null}</span>)}</span></div>
        <button type="button" className={styles.nextButton} aria-controls={id} data-pointer-feedback="local" onClick={event => select((index + 1) % TRIVIA.length, event.detail === 0)}><ControlVisual>Next question</ControlVisual></button>
      </div>
      <span className={styles.srOnly} role="status">{`Trivia ${index + 1} of ${TRIVIA.length}. ${TRIVIA[index].question}`}</span>
    </div>
    <noscript><style>{`[data-trivia-interactive] { display: none; }`}</style><div className={styles.staticStories}>{TRIVIA.map(trivia => <p key={trivia.question}>{trivia.answer}</p>)}</div></noscript>
  </div>;
});
