"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { STAIRS_MOTION } from "../lib/stairs-motion";

type NavigationOptions = { scroll?: boolean; replace?: boolean };
type Destination = { href: string; pathname: string; options: NavigationOptions; historyEvent?: PopStateEvent };
type Phase = "idle" | "covering" | "covered" | "revealing";
type Direction = "forward" | "back";
const HISTORY_POSITION = "portfolioNavigationPosition";
// Keep the tuned total while giving the five bands a gentler rolling stagger.
const PAGE_MOTION_DURATION_MS = 610;
const PAGE_STAGGER_MS = 30;
const PAGE_TRAVEL_SCALE = (PAGE_MOTION_DURATION_MS - 2 * (STAIRS_MOTION.count - 1) * PAGE_STAGGER_MS) /
  (STAIRS_MOTION.enter + STAIRS_MOTION.exit);
const NavigationContext = createContext<((href: string, options: NavigationOptions) => boolean) | null>(null);

function linkDirection(from: string, to: string): Direction {
  const depth = (path: string) => path === "/" ? 0 : path.startsWith("/work/") ? 2 : 1;
  return depth(to) < depth(from) ? "back" : "forward";
}

function prepareNavigation() {
  // Unlock an open menu while the curtain completely covers it.
  flushSync(() => window.dispatchEvent(new Event("portfolio:before-navigation")));
}

export function NavigationTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const pendingRef = useRef<Destination | null>(null);
  const animationsRef = useRef<Animation[]>([]);
  const sequenceRef = useRef(0);
  const committedPathRef = useRef(pathname);
  const frameRef = useRef(0);
  const directionRef = useRef<Direction>("forward");
  const historyPositionRef = useRef(0);
  const replayingHistoryRef = useRef(false);

  const stopMotion = useCallback(() => {
    ++sequenceRef.current;
    cancelAnimationFrame(frameRef.current);
    animationsRef.current.forEach((animation) => animation.cancel());
    animationsRef.current = [];
  }, []);

  const setPhase = useCallback((phase: Phase) => {
    phaseRef.current = phase;
    if (curtainRef.current) {
      curtainRef.current.dataset.phase = phase;
      if (phase === "idle") curtainRef.current.style.opacity = "";
    }
  }, []);

  const animateCurtain = useCallback(async (cover: boolean) => {
    const curtain = curtainRef.current;
    if (!curtain) return false;
    const sequence = ++sequenceRef.current;
    const panels = Array.from(curtain.querySelectorAll<HTMLElement>(".route-curtain-panel"));
    const backdrop = curtain.querySelector<HTMLElement>(".route-curtain-scrim");
    const direction = directionRef.current;
    const enteringTransform = direction === "back" ? "translateX(100%)" : "translateX(-100%)";
    // Start beyond the entering edge; interrupted motion keeps its current position.
    if (cover && phaseRef.current === "idle") {
      panels.forEach((panel) => { panel.style.transform = enteringTransform; });
    }
    const transforms = panels.map((panel) => getComputedStyle(panel).transform);
    const opacity = getComputedStyle(curtain).opacity;
    const backdropOpacity = backdrop ? getComputedStyle(backdrop).opacity : "0";
    animationsRef.current.forEach((animation) => animation.cancel());
    panels.forEach((panel, index) => { panel.style.transform = transforms[index]; });
    if (backdrop) backdrop.style.opacity = backdropOpacity;
    setPhase(cover ? "covering" : "revealing");
    curtain.dataset.direction = direction;
    const timing = getComputedStyle(document.documentElement);
    const easing = timing.getPropertyValue("--page-transition-ease").trim();
    // Optional CSS overrides allow slow playback without forking the shared defaults.
    const panelDuration = (cover ? STAIRS_MOTION.enter : STAIRS_MOTION.exit) * PAGE_TRAVEL_SCALE;
    const duration = parseFloat(timing.getPropertyValue(cover ? "--route-curtain-duration" : "--route-curtain-exit-duration")) || panelDuration;
    const stagger = parseFloat(timing.getPropertyValue("--route-curtain-stagger")) || PAGE_STAGGER_MS;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forcedColors = window.matchMedia("(forced-colors: active)").matches;
    // Continue across the viewport on reveal instead of returning to the entering edge.
    const target = cover ? "translateX(0%)" : direction === "back" ? "translateX(-100%)" : "translateX(100%)";
    const animations = reduce ? [curtain.animate([{ opacity }, { opacity: cover ? 1 : 0 }], {
      id: cover ? "route-curtain-cover" : "route-curtain-reveal",
      duration: forcedColors ? 0 : 80, easing, fill: "both",
    })] : [...panels.map((panel, index) => panel.animate([{ transform: transforms[index] }, { transform: target }], {
      id: `route-curtain-${cover ? "cover" : "reveal"}-${index}`,
      duration: forcedColors ? 0 : duration,
      delay: forcedColors ? 0 : (direction === "back" ? panels.length - 1 - index : index) * stagger,
      easing, fill: "both",
    })), ...(backdrop ? [backdrop.animate([{ opacity: backdropOpacity }, { opacity: cover ? STAIRS_MOTION.backdropOpacity : 0 }], {
      id: `route-scrim-${cover ? "cover" : "reveal"}`,
      duration: forcedColors ? 0 : panelDuration + (STAIRS_MOTION.count - 1) * PAGE_STAGGER_MS, easing, fill: "both",
    })] : [])];
    if (!reduce) curtain.style.opacity = "1";
    animationsRef.current = animations;
    try {
      await Promise.all(animations.map((animation) => animation.finished));
    } catch {
      return false; // A newer click retargeted the current motion.
    }
    if (sequence !== sequenceRef.current) return false;
    panels.forEach((panel) => { panel.style.transform = target; });
    curtain.style.opacity = reduce && !cover ? "0" : "1";
    if (backdrop) backdrop.style.opacity = !reduce && cover ? String(STAIRS_MOTION.backdropOpacity) : "0";
    animations.forEach((animation) => animation.cancel());
    animationsRef.current = [];
    return true;
  }, [setPhase]);

  const reveal = useCallback(async () => {
    if (await animateCurtain(false)) {
      pendingRef.current = null;
      setPhase("idle");
    }
  }, [animateCurtain, setPhase]);

  const navigateCovered = useCallback(() => {
    const destination = pendingRef.current;
    if (!destination) return;
    setPhase("covered");
    prepareNavigation();
    if (destination.historyEvent) {
      // Let Next restore the original history entry once the old page is covered.
      replayingHistoryRef.current = true;
      try { window.dispatchEvent(new PopStateEvent("popstate", { state: destination.historyEvent.state })); }
      finally { replayingHistoryRef.current = false; }
    } else {
      const options = { scroll: destination.options.scroll };
      if (destination.options.replace) router.replace(destination.href, options);
      else router.push(destination.href, options);
    }
    // A second click can select the current page while the first is still covering.
    if (committedPathRef.current === destination.pathname) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => { void reveal(); });
      });
    }
  }, [router, reveal, setPhase]);

  const navigate = useCallback((href: string, options: NavigationOptions) => {
    const destination = new URL(href, window.location.href);
    if (destination.origin !== window.location.origin || window.matchMedia("(forced-colors: active)").matches) return false;
    if (destination.pathname === window.location.pathname && phaseRef.current === "idle") return false;
    if (destination.pathname !== committedPathRef.current) router.prefetch(destination.pathname + destination.search);
    if (phaseRef.current !== "covering" && phaseRef.current !== "covered") {
      directionRef.current = linkDirection(committedPathRef.current, destination.pathname);
    }
    pendingRef.current = { href: destination.pathname + destination.search + destination.hash, pathname: destination.pathname, options };
    cancelAnimationFrame(frameRef.current);
    if (phaseRef.current !== "covering" && phaseRef.current !== "covered") {
      void animateCurtain(true).then((complete) => { if (complete) navigateCovered(); });
    }
    return true;
  }, [animateCurtain, navigateCovered, router]);

  useLayoutEffect(() => {
    const historyPosition: unknown = window.history.state?.[HISTORY_POSITION];
    if (pendingRef.current?.historyEvent || committedPathRef.current === pathname) {
      if (typeof historyPosition === "number") historyPositionRef.current = historyPosition;
    } else if (!pendingRef.current?.options.replace) {
      ++historyPositionRef.current;
    }
    // Preserve Next's state while adding a position for Back/Forward direction.
    window.history.replaceState({ ...window.history.state, [HISTORY_POSITION]: historyPositionRef.current }, "");
    committedPathRef.current = pathname;
    if (phaseRef.current !== "covered" || !pendingRef.current) return;
    if (pendingRef.current.pathname === pathname) void reveal();
    else frameRef.current = requestAnimationFrame(navigateCovered);
  }, [pathname, navigateCovered, reveal]);

  useEffect(() => {
    function onPopState(event: PopStateEvent) {
      if (replayingHistoryRef.current) return;
      if (window.location.pathname === committedPathRef.current && !pendingRef.current?.historyEvent) return;
      if (!event.state || window.matchMedia("(forced-colors: active)").matches) return;
      event.stopImmediatePropagation();
      const position: unknown = event.state[HISTORY_POSITION];
      directionRef.current = typeof position === "number" && position !== historyPositionRef.current
        ? position < historyPositionRef.current ? "back" : "forward"
        : linkDirection(committedPathRef.current, window.location.pathname);
      pendingRef.current = { href: window.location.pathname + window.location.search + window.location.hash, pathname: window.location.pathname, options: {}, historyEvent: event };
      cancelAnimationFrame(frameRef.current);
      if (phaseRef.current === "covered") navigateCovered();
      else if (phaseRef.current !== "covering") {
        void animateCurtain(true).then((complete) => { if (complete) navigateCovered(); });
      }
    }
    function finishMotion() { animationsRef.current.forEach((animation) => animation.finish()); }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("popstate", onPopState, { capture: true });
    reducedMotion.addEventListener("change", finishMotion);
    return () => {
      window.removeEventListener("popstate", onPopState, { capture: true });
      reducedMotion.removeEventListener("change", finishMotion);
    };
  }, [animateCurtain, navigateCovered]);

  useEffect(() => {
    const curtain = curtainRef.current;
    return () => {
      // Suspense can disconnect effects while retaining this live curtain.
      if (!curtain?.isConnected) stopMotion();
    };
  }, [stopMotion]);

  return <NavigationContext.Provider value={navigate}>
    {children}
    <div className="route-curtain" data-phase="idle" aria-hidden="true" ref={curtainRef}>
      <div className="route-curtain-scrim" />
      {Array.from({ length: STAIRS_MOTION.count }, (_, index) => <div className="route-curtain-panel" key={index} />)}
    </div>
  </NavigationContext.Provider>;
}

export function TransitionLink({ href, onNavigate, scroll, replace, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const navigate = useContext(NavigationContext);
  return <NextLink {...props} href={href} scroll={scroll} replace={replace} onNavigate={(event) => {
    let prevented = false;
    onNavigate?.({ preventDefault() { prevented = true; event.preventDefault(); } });
    if (prevented) return;
    if (navigate?.(href, { scroll, replace })) event.preventDefault();
    else if (new URL(href, window.location.href).pathname !== window.location.pathname) prepareNavigation();
  }} />;
}
