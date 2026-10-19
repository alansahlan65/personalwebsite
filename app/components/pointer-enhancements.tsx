"use client";

import { motionValue, springValue, scroll, type MotionValue } from "motion";
import { ArrowUpRight } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { MAGNET_SPRING } from "../lib/interaction-motion";

type CursorMode = "hidden" | "dot" | "image" | "action-image";

type MagnetStrength = "text" | "control" | "project";
type MagnetState = {
  target: HTMLElement;
  parts: HTMLElement[];
  sourceX: MotionValue<number>;
  sourceY: MotionValue<number>;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  unsubscribe: (() => void)[];
};

const MAGNET_LIMIT: Record<MagnetStrength, number> = { text: 5, control: 8, project: 6 };
const CURSOR_DOT_SCALE = 7 / 72;
const CURSOR_SCALE_TIME = 45;

export function PointerEnhancements() {
  const pathname = usePathname();
  const discRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const refreshRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const disc = discRef.current;
    const arrow = arrowRef.current;
    if (!disc || !arrow || !window.CSS?.supports("mix-blend-mode", "difference") || typeof ResizeObserver === "undefined") return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const magnets = new Map<HTMLElement, MagnetState>();
    const resizeObserver = new ResizeObserver(() => recheckPointer());
    let active: HTMLElement | null = null;
    let frame = 0;
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    let cursorGoalX = 0;
    let cursorGoalY = 0;
    let cursorVisible = false;
    let cursorMode: CursorMode = "hidden";
    let cursorScale = CURSOR_DOT_SCALE;
    let cursorScaleGoal = CURSOR_DOT_SCALE;
    let lastFrameTime: number | null = null;
    let enabled = finePointer.matches && !reducedMotion.matches && !forcedColors.matches;
    let pendingPoint: { x: number; y: number; element: Element | null } | null = null;
    let needsHitTest = false;
    let activeBounds: DOMRect | null = null;

    function schedule() {
      if (!frame && document.visibilityState === "visible") {
        lastFrameTime ??= performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function tick(time: number) {
      frame = 0;
      const elapsed = Math.min(time - (lastFrameTime ?? time), 64);
      lastFrameTime = time;
      const point = pendingPoint;
      pendingPoint = null;
      if (point || needsHitTest) {
        needsHitTest = false;
        const x = point?.x ?? pointerX;
        const y = point?.y ?? pointerY;
        if (x !== null && x !== undefined && y !== null && y !== undefined) {
          const element = point?.element?.isConnected ? point.element : document.elementFromPoint(x, y);
          if (element) updateAt(x, y, element);
          else reset();
        }
      }
      let moving = false;

      if (cursorVisible) {
        // Position is immediate. Only the image disc's size eases, at the same
        // speed on 60Hz and higher-refresh displays.
        cursorScale += (cursorScaleGoal - cursorScale) * (1 - Math.exp(-elapsed / CURSOR_SCALE_TIME));
        moving = Math.abs(cursorScaleGoal - cursorScale) > 0.005;
        if (!moving) cursorScale = cursorScaleGoal;
        disc!.style.transform = `translate3d(${cursorGoalX}px, ${cursorGoalY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;
        if (cursorMode === "action-image") arrow!.style.transform = `translate3d(${cursorGoalX}px, ${cursorGoalY}px, 0) translate(-50%, -50%)`;
        if (disc!.dataset.mode !== cursorMode) disc!.dataset.mode = cursorMode;
        const showArrow = cursorMode === "action-image" ? "true" : "false";
        if (arrow!.dataset.visible !== showArrow) arrow!.dataset.visible = showArrow;
        if (!document.documentElement.hasAttribute("data-cursor-ready")) document.documentElement.dataset.cursorReady = "true";
      }

      if (moving) schedule();
      else lastFrameTime = null;
    }

    function disposeMagnet(state: MagnetState) {
      state.unsubscribe.forEach((unsubscribe) => unsubscribe());
      state.springX.destroy();
      state.springY.destroy();
      state.sourceX.destroy();
      state.sourceY.destroy();
      state.parts.forEach((part) => { part.style.transform = ""; });
      state.target.removeAttribute("data-magnet-active");
      magnets.delete(state.target);
    }

    function createMagnet(target: HTMLElement) {
      const sourceX = motionValue(0);
      const sourceY = motionValue(0);
      const state: MagnetState = {
        target,
        parts: Array.from(target.querySelectorAll<HTMLElement>("[data-magnet-part]")),
        sourceX,
        sourceY,
        springX: springValue(sourceX, MAGNET_SPRING),
        springY: springValue(sourceY, MAGNET_SPRING),
        unsubscribe: [],
      };
      function render() {
        if (!document.contains(target)) {
          disposeMagnet(state);
          return;
        }
        const x = state.springX.get();
        const y = state.springY.get();
        if (target !== active && Math.abs(x) < 0.05 && Math.abs(y) < 0.05 && Math.abs(state.springX.getVelocity()) < 0.5 && Math.abs(state.springY.getVelocity()) < 0.5) {
          disposeMagnet(state);
          return;
        }
        state.parts.forEach((part) => { part.style.transform = `translate3d(${x}px, ${y}px, 0)`; });
      }
      function finish() {
        if (target !== active && state.springX.get() === 0 && state.springY.get() === 0) disposeMagnet(state);
      }
      state.unsubscribe.push(
        state.springX.on("change", render), state.springY.on("change", render),
        state.springX.on("animationComplete", finish), state.springY.on("animationComplete", finish),
      );
      magnets.set(target, state);
      target.dataset.magnetActive = "true";
      return state;
    }

    function releaseActive() {
      if (!active) return;
      const target = active;
      active = null;
      activeBounds = null;
      resizeObserver.unobserve(target);
      const state = magnets.get(target);
      if (state) {
        state.sourceX.set(0);
        state.sourceY.set(0);
        if (!state.springX.isAnimating() && !state.springY.isAnimating()) disposeMagnet(state);
      }
    }

    function setCursorMode(mode: CursorMode) {
      cursorMode = mode;
      if (mode === "hidden") {
        cursorVisible = false;
        cursorScale = CURSOR_DOT_SCALE;
        cursorScaleGoal = CURSOR_DOT_SCALE;
        disc!.dataset.mode = "hidden";
        arrow!.dataset.visible = "false";
        document.documentElement.removeAttribute("data-cursor-ready");
        return;
      }
      cursorVisible = true;
      cursorScaleGoal = mode === "dot" ? CURSOR_DOT_SCALE : 1;
      if (mode === "dot") cursorScale = CURSOR_DOT_SCALE;
      schedule();
    }

    function clearMagnets() {
      activeBounds = null;
      if (active) resizeObserver.unobserve(active);
      active = null;
      magnets.forEach(disposeMagnet);
    }

    function reset() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastFrameTime = null;
      pendingPoint = null;
      needsHitTest = false;
      clearMagnets();
      pointerX = null;
      pointerY = null;
      setCursorMode("hidden");
    }

    function updateAt(x: number, y: number, element: Element) {
      if (!enabled || document.visibilityState === "hidden") {
        reset();
        return;
      }
      const menu = document.querySelector(".stairs-menu");
      pointerX = x;
      pointerY = y;
      cursorGoalX = x;
      cursorGoalY = y;

      const selection = window.getSelection();
      const stationary = (selection && !selection.isCollapsed)
        || (menu && !menu.contains(element))
        || element.closest('input, textarea, select, [contenteditable], video, audio, iframe, [aria-disabled="true"], button:disabled');
      if (stationary) {
        setCursorMode("dot");
        clearMagnets();
        return;
      }
      const image = element.closest("img");
      const actionableImage = image?.closest("a[href], button");
      setCursorMode(image ? actionableImage ? "action-image" : "image" : "dot");

      const target = element.closest<HTMLElement>("[data-magnet]");
      if (target !== active) {
        releaseActive();
        active = target;
        if (active) resizeObserver.observe(active);
      }
      if (!target || target.matches(":focus-visible")) {
        releaseActive();
        return;
      }
      const state = magnets.get(target) ?? createMagnet(target);
      const rect = activeBounds ?? (activeBounds = target.getBoundingClientRect());
      const strength = MAGNET_LIMIT[target.dataset.magnet as MagnetStrength] ?? MAGNET_LIMIT.text;
      state.sourceX.set(Math.max(-strength, Math.min(strength, ((x - rect.left - rect.width / 2) / (rect.width / 2)) * strength)));
      state.sourceY.set(Math.max(-strength, Math.min(strength, ((y - rect.top - rect.height / 2) / (rect.height / 2)) * strength)));
    }

    function recheckPointer() {
      if (pointerX === null || pointerY === null) return;
      activeBounds = null;
      // Scroll/resize and high-rate input share one hit test per rendered frame.
      pendingPoint = null;
      needsHitTest = true;
      schedule();
    }

    function onPointerMove(event: PointerEvent) {
      if (!enabled || (event.pointerType !== "mouse" && event.pointerType !== "pen")) {
        reset();
        return;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      pendingPoint = { x: event.clientX, y: event.clientY, element: event.target instanceof Element ? event.target : null };
      schedule();
    }

    function onPointerOut(event: PointerEvent) {
      if (!event.relatedTarget) reset();
    }

    function onMediaChange() {
      enabled = finePointer.matches && !reducedMotion.matches && !forcedColors.matches;
      reset();
    }

    function onFocusIn(event: FocusEvent) {
      if (event.target instanceof Element && event.target.matches(":focus-visible")) clearMagnets();
    }

    function onSelectionChange() {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) clearMagnets();
      recheckPointer();
    }

    function onSurfaceChange() {
      clearMagnets();
      if (pointerX === null || pointerY === null) return;
      // Keep one cursor owner while the menu or route replaces its content.
      // The next frame hit-tests the new DOM at the last real coordinates.
      setCursorMode("dot");
      recheckPointer();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") reset();
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    document.addEventListener("pointerdown", onPointerMove, { passive: true });
    document.addEventListener("selectionchange", onSelectionChange);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", reset);
    const stopScroll = scroll(recheckPointer);
    window.addEventListener("resize", recheckPointer);
    window.addEventListener("portfolio:menu-change", onSurfaceChange);
    window.addEventListener("portfolio:project-entry", onSurfaceChange);
    document.fonts.addEventListener("loadingdone", recheckPointer);
    finePointer.addEventListener("change", onMediaChange);
    reducedMotion.addEventListener("change", onMediaChange);
    forcedColors.addEventListener("change", onMediaChange);
    document.documentElement.dataset.pointerEnhancementsMounted = "true";
    refreshRef.current = onSurfaceChange;
    return () => {
      refreshRef.current = null;
      document.documentElement.removeAttribute("data-pointer-enhancements-mounted");
      reset();
      resizeObserver.disconnect();
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerMove);
      document.removeEventListener("selectionchange", onSelectionChange);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", reset);
      stopScroll();
      window.removeEventListener("resize", recheckPointer);
      window.removeEventListener("portfolio:menu-change", onSurfaceChange);
      window.removeEventListener("portfolio:project-entry", onSurfaceChange);
      document.fonts.removeEventListener("loadingdone", recheckPointer);
      finePointer.removeEventListener("change", onMediaChange);
      reducedMotion.removeEventListener("change", onMediaChange);
      forcedColors.removeEventListener("change", onMediaChange);
    };
  }, []);

  useEffect(() => {
    refreshRef.current?.();
  }, [pathname]);

  return (
    <>
      <span ref={discRef} className="site-cursor" data-mode="hidden" aria-hidden="true" />
      <span ref={arrowRef} className="site-cursor-arrow" data-visible="false" aria-hidden="true">
        <ArrowUpRight size={25} weight="bold" aria-hidden="true" style={{ color: "#fff", filter: "drop-shadow(0 1px 1px #20221f)" }} />
      </span>
    </>
  );
}
