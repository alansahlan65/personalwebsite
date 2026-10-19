"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import dialogueStyles from "./speech-bubble.module.css";
import styles from "./alan-character.module.css";

const DEFAULT_POSE = "/images/alan-character-default.png";
const WAVE_POSE = "/images/alan-character-wave.png";
const GREETING_POSE = "/images/alan-character-greeting.png";
const IMAGE_SIZES = "(max-width: 650px) calc((100vw - 48px) * .8), (max-width: 1000px) 42vw, 480px";
const DIRECTIONS = ["right", "bottom-right", "bottom", "bottom-left", "left", "top-left", "top", "top-right"] as const;
const HEAD_VIEWS = ["front", ...DIRECTIONS] as const;
type HeadFacing = (typeof HEAD_VIEWS)[number];
const DIRECTIONAL_MOTION = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) and (forced-colors: none)";
function subscribeToDirectionInput(onChange: () => void) {
  const query = window.matchMedia(DIRECTIONAL_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getDirectionInput = () => window.matchMedia(DIRECTIONAL_MOTION).matches;
const getServerDirectionInput = () => false;

function blendLayers(layers: HTMLElement[], target: number, animations: Animation[], duration: number, easing: string, instant: boolean) {
  // Read the interrupted frame before cancelling. All layers share one progress
  // curve and their weights always total one, including rapid retargets.
  const weights = layers.map(layer => Number(getComputedStyle(layer).opacity));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  animations.forEach(animation => animation.cancel());
  layers.forEach((layer, index) => { layer.style.opacity = index === target ? "1" : "0"; });
  if (instant || !layers[0]?.animate) return [];
  const startTime = document.timeline.currentTime;
  return layers.flatMap((layer, index) => {
    const from = total > 0 ? weights[index] / total : Number(index === target);
    const to = Number(index === target);
    if (from === to) return [];
    const animation = layer.animate([{ opacity: from }, { opacity: to }], { duration, easing });
    animation.startTime = startTime;
    return [animation];
  });
}

export function AlanCharacter() {
  const characterRef = useRef<HTMLButtonElement>(null);
  const loadedHeadsRef = useRef(new Set<HeadFacing>());
  const loadedGreetingHeadsRef = useRef(new Set<HeadFacing>());
  const keyboardRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const blendsRef = useRef<Animation[][]>([[], [], []]);
  const [headFacing, setHeadFacing] = useState<HeadFacing>("front");
  const [headReady, setHeadReady] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [greetingReady, setGreetingReady] = useState(false);
  const [greetingHeadsReady, setGreetingHeadsReady] = useState(false);
  const directionalMotion = useSyncExternalStore(subscribeToDirectionInput, getDirectionInput, getServerDirectionInput);
  const greetingActive = greeting && greetingReady;
  const displayedFacing = !directionalMotion || (greetingActive && !greetingHeadsReady) ? "front" : headFacing;

  useLayoutEffect(() => {
    const character = characterRef.current;
    if (!character) return;
    const instant = keyboardRef.current || !directionalMotion || !CSS.supports("mix-blend-mode", "plus-lighter");
    const easing = getComputedStyle(character).getPropertyValue("--project-title-ease").trim();
    const faces = [...character.querySelectorAll<HTMLElement>("[data-head-expression]")];
    const target = faces.findIndex(face => face.parentElement?.dataset.headView === displayedFacing && face.dataset.headExpression === (greetingActive ? "greeting" : "rest"));
    blendsRef.current[0] = blendLayers(faces, target, blendsRef.current[0], 150, easing, instant);
  }, [displayedFacing, greetingActive, directionalMotion]);

  useLayoutEffect(() => {
    const character = characterRef.current;
    if (!character) return;
    const instant = keyboardRef.current || !directionalMotion || !CSS.supports("mix-blend-mode", "plus-lighter");
    const computed = getComputedStyle(character);
    const easing = computed.getPropertyValue("--project-title-ease").trim();
    const duration = Number(computed.getPropertyValue("--alan-pose-duration-ms"));
    const bodies = [...character.querySelectorAll<HTMLElement>('[data-character-part="rest-body"], [data-character-part="greeting-body"]')];
    blendsRef.current[1] = blendLayers(bodies, Number(greetingActive), blendsRef.current[1], duration, easing, instant);
    const arms = [...character.querySelectorAll<HTMLElement>('[data-character-part="rest-arm"], [data-character-part="wave-arm"]')];
    blendsRef.current[2] = blendLayers(arms, Number(greetingActive), blendsRef.current[2], duration, easing, instant);
  }, [greetingActive, directionalMotion]);

  useEffect(() => () => { blendsRef.current.flat().forEach(animation => animation.cancel()); }, []);

  useEffect(() => {
    const character = characterRef.current;
    if (!character) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forced = window.matchMedia("(forced-colors: active)");
    let facing: HeadFacing = "front";
    let bounds = character.getBoundingClientRect();
    let visible = true;
    let frame = 0;
    let boundsDirty = false;
    let pointer: { x: number; y: number } | null = null;
    character.dataset.input = keyboardRef.current ? "keyboard" : "pointer";

    function face(next: HeadFacing) {
      if (next === facing) return;
      facing = next;
      setHeadFacing(next);
    }
    function reset() { face("front"); }
    function measure() {
      boundsDirty = true;
      if (headReady && visible && fine.matches && !reduce.matches && !forced.matches && !document.hidden && !frame) frame = requestAnimationFrame(update);
    }
    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !fine.matches || reduce.matches || forced.matches || !visible || document.hidden || character!.matches(":focus-visible")) return;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      if (!headReady) return;
      pointer = lastPointerRef.current;
      if (!frame) frame = requestAnimationFrame(update);
    }
    function update() {
      frame = 0;
      if (boundsDirty) { bounds = character!.getBoundingClientRect(); boundsDirty = false; }
      if (!pointer) return;
      const point = pointer;
      pointer = null;
      const centerX = bounds.left + bounds.width * .5;
      const centerY = bounds.top + bounds.height * .26;
      const x = point.x - centerX;
      const y = point.y - centerY;
      // A neutral area and angular hysteresis prevent flickering between sprites.
      const neutralRadius = Math.max(32, bounds.width * .13) + (facing === "front" ? 8 : 0);
      if (Math.hypot(x, y) < neutralRadius) { reset(); return; }
      const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      const next = DIRECTIONS[Math.round(angle / 45) % DIRECTIONS.length];
      if (facing !== "front" && facing !== next) {
        const offset = (angle - DIRECTIONS.indexOf(facing) * 45 + 540) % 360 - 180;
        if (Math.abs(offset) < 27.5) return;
      }
      face(next);
    }
    function onKeyDown(event: KeyboardEvent) {
      keyboardRef.current = true;
      character!.dataset.input = "keyboard";
      if (event.key === "Tab") reset();
      if (event.key === "Escape") setGreeting(false);
    }
    function onPointerDown(event: PointerEvent) {
      keyboardRef.current = false;
      character!.dataset.input = "pointer";
      if (!character!.contains(event.target as Node)) setGreeting(false);
    }
    function onPreference() {
      if (reduce.matches || forced.matches || !fine.matches) {
        cancelAnimationFrame(frame); frame = 0; pointer = null;
        lastPointerRef.current = null;
        blendsRef.current.flat().forEach(animation => animation.cancel());
        // Front stays mounted when pointer-only views are removed.
        loadedHeadsRef.current = new Set(loadedHeadsRef.current.has("front") ? ["front"] : []);
        loadedGreetingHeadsRef.current = new Set(loadedGreetingHeadsRef.current.has("front") ? ["front"] : []);
        setHeadReady(false); setGreetingHeadsReady(false);
        reset();
      }
    }
    function stopTracking() { cancelAnimationFrame(frame); frame = 0; pointer = null; lastPointerRef.current = null; reset(); }
    function onVisibility() { if (document.hidden) stopTracking(); else measure(); }
    function onLeave() { stopTracking(); }
    function onBlur() { stopTracking(); setGreeting(false); }
    const resize = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    resize?.observe(character);
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) { stopTracking(); setGreeting(false); }
      else measure();
    }) : null;
    observer?.observe(character);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    character.addEventListener("animationend", measure);
    window.addEventListener("blur", onBlur);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    for (const query of [fine, reduce, forced]) query.addEventListener("change", onPreference);
    // A pointer that arrived during image decoding still gets its first
    // facing update, without requiring the visitor to move a second time.
    if (headReady && lastPointerRef.current) {
      pointer = lastPointerRef.current;
      if (!frame) frame = requestAnimationFrame(update);
    }
    return () => {
      resize?.disconnect(); observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      character.removeEventListener("animationend", measure);
      window.removeEventListener("blur", onBlur);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const query of [fine, reduce, forced]) query.removeEventListener("change", onPreference);
    };
  }, [headReady]);

  return (
    <button ref={characterRef} type="button" className={`portrait-frame ${styles.character}`} aria-label="Say hello to Alan" data-pointer-feedback="local" data-greeting={greetingActive} data-head-ready={headReady} data-greeting-head-ready={greetingHeadsReady}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        keyboardRef.current = false;
        event.currentTarget.dataset.input = "pointer";
        setGreeting(true);
      }}
      onPointerLeave={() => { if (!characterRef.current?.matches(":focus-visible")) setGreeting(false); }}
      onFocus={() => { if (keyboardRef.current || characterRef.current?.matches(":focus-visible")) setGreeting(true); }}
      onBlur={() => setGreeting(false)}
      onClick={() => setGreeting(true)}>
      <span className={styles.art}>
        <span className={styles.bodies}>
          <span className={styles.body} data-character-part="rest-body"><Image src={WAVE_POSE} alt="Alan Sahlan" fill preload sizes={IMAGE_SIZES} draggable={false} /></span>
          <span className={styles.bodyGreeting} data-character-part="greeting-body" aria-hidden="true"><Image src={GREETING_POSE} alt="" fill preload sizes={IMAGE_SIZES} draggable={false} /></span>
        </span>
        <span className={styles.arms} aria-hidden="true">
          <span className={styles.restArm} data-character-part="rest-arm"><Image src={DEFAULT_POSE} alt="" fill sizes={IMAGE_SIZES} draggable={false} /></span>
          <span className={styles.waveArm} data-character-part="wave-arm"><Image src={GREETING_POSE} alt="" fill loading="eager" sizes={IMAGE_SIZES} draggable={false} onLoad={() => setGreetingReady(true)} /></span>
        </span>
        <span className={styles.head} aria-hidden="true">
          {HEAD_VIEWS.filter(direction => direction === "front" || directionalMotion).map((direction) => (
            <span key={direction} className={styles.headView} data-head-view={direction} data-active={displayedFacing === direction}>
              <Image className={styles.restFace} data-head-expression="rest" src={direction === "front" ? DEFAULT_POSE : `/images/alan-head-${direction}.png`} alt="" fill preload={direction === "front"} loading={direction === "front" ? undefined : "eager"} sizes={IMAGE_SIZES} draggable={false} onLoad={() => {
                loadedHeadsRef.current.add(direction);
                if (loadedHeadsRef.current.size === HEAD_VIEWS.length) setHeadReady(true);
              }} />
              <Image className={styles.greetingFace} data-head-expression="greeting" src={direction === "front" ? GREETING_POSE : `/images/alan-head-${direction}-greeting.png`} alt="" fill loading="eager" sizes={IMAGE_SIZES} draggable={false} onLoad={() => {
                loadedGreetingHeadsRef.current.add(direction);
                if (loadedGreetingHeadsRef.current.size === HEAD_VIEWS.length) setGreetingHeadsReady(true);
              }} />
            </span>
          ))}
        </span>
      </span>
      <span className={styles.ground} aria-hidden="true" />
      <span className={`${dialogueStyles.dialogue} ${styles.bubble}`} aria-hidden="true">
        Hi! Nice to meet you!
        <span className={dialogueStyles.accent} aria-hidden="true" />
      </span>
      <span className={styles.announcement} role="status">{greeting ? "Hi! Nice to meet you!" : ""}</span>
    </button>
  );
}
