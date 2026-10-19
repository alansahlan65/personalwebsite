"use client";

import { useId, useState } from "react";
import { motion, useDragControls, useReducedMotion } from "motion/react";
import styles from "./about-notebook.module.css";

const NOTES = [
  { tab: "Movies", label: "Away from the canvas", title: "Lost in a good story.", text: "I like watching movies. Away from designing screens, I like getting into a story on one.", footer: "A different kind of screen time." },
  { tab: "Gaming", label: "A little side quest", title: "Just one more round.", text: "I like gaming, too. And I love how small details can add so much to an experience. Here are three to collect.", footer: "Every little detail counts." },
  { tab: "History", label: "Another kind of story", title: "A little further back.", text: "I love reading history. There's always another chapter to explore, and more to be curious about.", footer: "Curiosity travels both ways." },
] as const;

function NoteDrawing({ index }: { index: number }) {
  const [scene, setScene] = useState(0);
  const [collected, setCollected] = useState<number[]>([]);
  const [chapter, setChapter] = useState(0);
  const scenes = ["Opening scene", "A little plot twist", "To be continued"];
  const chapters = ["How did we get here?", "What happened next?", "What can we learn?"];
  if (index === 0) return (
    <div className={styles.movieScene}>
      <div className={styles.filmStrip} aria-hidden="true" data-scene={scene}>
        <span className={styles.filmPerforations} /><svg viewBox="0 0 180 70" fill="none">
          {scene === 0 ? <><circle cx="139" cy="19" r="9" /><path d="M8 62V37h20v25m4 0V22h24v40m4 0V42h17v20m8 0V31h25v31m5 0V45h17v17m7 0V33h29v29M8 62h160" /><path d="M39 31h4m5 0h3m-12 9h4m5 0h3" /></> : scene === 1 ? <><path d="m10 58 45-41 30 30 22-20 64 31M10 58h161m-129-29 13 9 9-12" /><circle cx="140" cy="15" r="8" /></> : <><path d="M34 19h113v34H34zM46 35h89" /><path d="m15 11 2 5 5 1-5 2-2 5-2-5-5-2 5-1zm142 37 2 5 5 1-5 2-2 5-2-5-5-2 5-1z" /></>}
        </svg><span className={styles.filmPerforations} />
      </div>
      <div className={styles.sceneControls}><span aria-live="polite">{scenes[scene]}</span><button type="button" data-pointer-feedback="local" onClick={() => setScene((scene + 1) % 3)}>Next scene <span aria-hidden="true">▷</span></button></div>
    </div>
  );
  if (index === 1) return (
    <div className={styles.gameScene}>
      <span className={styles.gameScore} role="status">{collected.length === 3 ? "Side quest complete!" : `${collected.length} / 3 little details`}</span>
      <div className={styles.gamePixels}>
        {[0, 1, 2].map(pixel => <button type="button" key={pixel} aria-label={`Collect detail ${pixel + 1}`} aria-pressed={collected.includes(pixel)}
          data-pointer-feedback="local" onClick={() => setCollected(current => current.includes(pixel) ? current : [...current, pixel])}>
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d={collected.includes(pixel) ? "m7 16 6 6 13-14" : "M13 3h6v8h8v6h-8v8h-6v-8H5v-6h8z"} /></svg>
        </button>)}
        <svg className={styles.controller} viewBox="0 0 92 58" fill="none" aria-hidden="true"><path d="M26 13h40c8 0 15 30 10 34s-16-10-21-10H37c-5 0-16 15-21 10s2-34 10-34zM46 13V5h12" /><path d="M30 20v15m-7-7h14" /><circle cx="60" cy="24" r="2" /><circle cx="68" cy="30" r="2" /></svg>
      </div>
      <button type="button" className={styles.resetGame} data-pointer-feedback="local" onClick={() => setCollected([])}>Play again <span aria-hidden="true">↺</span></button>
    </div>
  );
  return (
    <div className={styles.historyScene}>
      <div className={styles.book}>
        <span className={styles.bookLeft} aria-hidden="true"><i /><i /><i /><i /><b>{["I", "II", "III"][chapter]}</b></span>
        <span className={styles.bookRight} aria-live="polite">{chapters[chapter]}<span className={styles.pageCorner} aria-hidden="true" /></span>
      </div>
      <button type="button" className={styles.turnPage} data-pointer-feedback="local" onClick={() => setChapter((chapter + 1) % 3)}>Turn the page <span aria-hidden="true">↗</span></button>
    </div>
  );
}

function NotebookCard({ noteIndex, index, still, reduceMotion, select }: { noteIndex: number; index: number; still: boolean; reduceMotion: boolean; select: (next: number, keyboard: boolean) => void }) {
  const controls = useDragControls();
  const rank = (noteIndex - index + NOTES.length) % NOTES.length;
  const active = rank === 0;
  const note = NOTES[noteIndex];
  return (
    <motion.article className={styles.note} data-note={note.tab.toLowerCase()} data-front={active || undefined}
      aria-hidden={!active} inert={!active} style={{ zIndex: NOTES.length - rank }}
      initial={false} animate={{ x: rank === 1 ? 9 : rank === 2 ? -5 : 0, y: -rank * 7, rotate: rank === 1 ? 4 : rank === 2 ? -4 : -1 }}
      transition={still ? { duration: 0 } : { type: "spring", duration: .3, bounce: .12 }}
      drag={active && !reduceMotion ? "x" : false} dragControls={controls} dragListener={false} dragConstraints={{ left: 0, right: 0 }} dragElastic={.22} dragMomentum={false}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 65 || Math.abs(info.velocity.x) > 500) select((index + (info.offset.x < 0 ? 1 : NOTES.length - 1)) % NOTES.length, false);
      }}>
      <div className={styles.dragHandle} onPointerDown={event => { if (active && !reduceMotion) { select(index, false); controls.start(event); } }}>
        <div className={styles.noteTop}><span>{note.label}</span><span>0{noteIndex + 1}</span></div>
        <h3>{note.title}</h3>
      </div>
      <NoteDrawing index={noteIndex} />
      <p>{note.text}</p>
      <span className={styles.noteFooter}>{note.footer}<span aria-hidden="true">✳</span></span>
    </motion.article>
  );
}

export function AboutNotebook() {
  const [index, setIndex] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const reduceMotion = useReducedMotion();
  const id = useId();
  const still = Boolean(reduceMotion || keyboard);

  function select(next: number, keyboardInput: boolean) {
    setKeyboard(keyboardInput);
    setIndex(next);
  }

  return (
    <div className={styles.notebook} role="group" aria-label="Notes about Alan" data-notebook="" data-still={still || undefined}>
      <div className={styles.notebookHeader}>
        <span className={styles.noteLabel}>A few things I get lost in</span>
        <span className={styles.noteHint}>Pick a note. Or swipe it.</span>
      </div>
      <div className={styles.deck} id={id}>
        <span className={styles.tape} aria-hidden="true" />
        {NOTES.map((note, noteIndex) => <NotebookCard key={note.tab} noteIndex={noteIndex} index={index} still={still} reduceMotion={Boolean(reduceMotion)} select={select} />)}
      </div>
      <div className={styles.noteControls}>
        <div className={styles.noteChoices} aria-label="Choose a note">
          {NOTES.map((note, noteIndex) => (
            <button type="button" key={note.tab} aria-label={`Read ${note.tab.toLowerCase()} note`} aria-pressed={index === noteIndex}
              aria-controls={id} data-pointer-feedback="local" onClick={(event) => select(noteIndex, event.detail === 0)}>
              <span aria-hidden="true">0{noteIndex + 1}</span>{note.tab}
            </button>
          ))}
        </div>
        <button type="button" className={styles.nextNote} aria-label="Read next note" data-pointer-feedback="local"
          onClick={(event) => select((index + 1) % NOTES.length, event.detail === 0)}><span aria-hidden="true">↗</span></button>
      </div>
      <span className={styles.srOnly} role="status" aria-live="polite">{NOTES[index].label}. {NOTES[index].title} {NOTES[index].text}</span>
      <noscript><style>{`[data-notebook] button, [data-notebook] .${styles.noteHint} { display: none; }`}</style><div className={styles.staticNotes}>{NOTES.slice(1).map(note => <p key={note.tab}><strong>{note.title}</strong> {note.text}</p>)}</div></noscript>
    </div>
  );
}

export function AboutCuriosity() {
  const [side, setSide] = useState("design");
  return (
    <div className={styles.curiosity} data-curiosity="">
      <span className={styles.curiosityLabel}>Same curiosity.<br />A new way to explore it.</span>
      <div className={styles.curiosityTrack}>
        <span aria-hidden="true" className={styles.curiosityLine} />
        <button type="button" aria-label="Explore design perspective" aria-pressed={side === "design"} data-pointer-feedback="local" onClick={() => setSide("design")}>
          <span aria-hidden="true" className={styles.pencil}>✎</span>Design
        </button>
        <span aria-hidden="true" className={styles.curiosityArrow}>↔</span>
        <button type="button" aria-label="Explore building perspective" aria-pressed={side === "build"} data-pointer-feedback="local" onClick={() => setSide("build")}>
          <span aria-hidden="true" className={styles.brackets}>&lt;/&gt;</span>Build
        </button>
      </div>
      <p aria-live="polite">{side === "design" ? "Understand the problem. Shape what happens next." : "Learn the constraints. Make the details respond."}</p>
    </div>
  );
}
