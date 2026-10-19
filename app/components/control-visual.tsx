"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { CONTROL_SPRING } from "../lib/interaction-motion";
import { useMotionPreference } from "./use-motion-preference";

const cancellations = new Set<() => void>();
function cancelAll() { cancellations.forEach(cancel => cancel()); }
function onVisibilityChange() { if (document.visibilityState === "hidden") cancelAll(); }

// Native buttons own activation and focus; only their painted child moves.
export function ControlVisual({ children, className = "", motionEnabled = true, pressScale = .97 }: { children: ReactNode; className?: string; motionEnabled?: boolean; pressScale?: number }) {
  const reduced = useMotionPreference();
  const visual = useRef<HTMLSpanElement>(null);
  const source = useMotionValue(1);
  const scale = useSpring(source, CONTROL_SPRING);
  const transform = useMotionTemplate`scale(${scale})`;
  useEffect(() => {
    const button = visual.current?.closest("button");
    if (!button) return;
    const reset = () => { source.jump(1); scale.jump(1); };
    const release = () => source.set(1);
    function press(event: PointerEvent) {
      if (!reduced && motionEnabled && !button!.disabled && event.isPrimary && event.button === 0 && !button!.matches(":focus-visible")) source.set(pressScale);
    }
    function focus() { if (button!.matches(":focus-visible")) reset(); }
    reset();
    if (!cancellations.size) {
      window.addEventListener("blur", cancelAll);
      document.addEventListener("visibilitychange", onVisibilityChange);
    }
    cancellations.add(reset);
    button.addEventListener("pointerdown", press);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointerleave", release);
    button.addEventListener("pointercancel", reset);
    button.addEventListener("focus", focus);
    button.addEventListener("blur", reset);
    return () => {
      cancellations.delete(reset);
      if (!cancellations.size) {
        window.removeEventListener("blur", cancelAll);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("pointerup", release);
      button.removeEventListener("pointerleave", release);
      button.removeEventListener("pointercancel", reset);
      button.removeEventListener("focus", focus);
      button.removeEventListener("blur", reset);
      reset();
    };
  }, [reduced, motionEnabled, pressScale, source, scale]);
  return <motion.span ref={visual} className={`control-visual ${className}`} data-control-visual=""
    style={{ transform: reduced || !motionEnabled ? "none" : transform }}>{children}</motion.span>;
}
