"use client";

import { useEffect } from "react";

const easing = "cubic-bezier(.16, 1, .3, 1)";
const entrances = [
  { selector: ".work .section-intro", kind: "soft" },
  { selector: ".project-row", kind: "soft" },
  { selector: ".about-copy p", kind: "copy" },
  { selector: ".about-details section", kind: "soft" },
  { selector: ".case-decision", kind: "soft" },
  { selector: ".case-reading h2", kind: "copy" },
  { selector: ".contact-note", kind: "copy" },
] as const;

export function PageMotion({ name }: { name: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-page-transition="${name}"]`);
    if (!root || !("IntersectionObserver" in window) || !Element.prototype.animate) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const active = new Set<Animation>();
    const restoredPosition = window.scrollY > 12 || Boolean(window.location.hash);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        if (reduce.matches || forcedColors.matches || document.hidden || element.contains(document.activeElement)) continue;

        const kind = element.dataset.pageMotion;
        const animation = element.animate(
          kind === "soft"
            ? [{ opacity: 0.68 }, { opacity: 1 }]
            : [{ opacity: 0.68, transform: "translate3d(0, 14px, 0)" }, { opacity: 1, transform: "none" }],
          { id: `page-motion-${kind}`, duration: kind === "soft" ? 320 : 420, easing },
        );
        active.add(animation);
        animation.addEventListener("finish", () => active.delete(animation), { once: true });
        animation.addEventListener("cancel", () => active.delete(animation), { once: true });
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    for (const entrance of entrances) {
      for (const element of root.querySelectorAll<HTMLElement>(entrance.selector)) {
        const bounds = element.getBoundingClientRect();
        if (restoredPosition && bounds.top < window.innerHeight && bounds.bottom > 0) continue;
        element.dataset.pageMotion = entrance.kind;
        observer.observe(element);
      }
    }

    const stop = () => {
      if (reduce.matches || forcedColors.matches || document.hidden) {
        for (const animation of active) animation.cancel();
      }
    };
    reduce.addEventListener("change", stop);
    forcedColors.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      observer.disconnect();
      reduce.removeEventListener("change", stop);
      forcedColors.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
      for (const animation of active) animation.cancel();
    };
  }, [name]);

  return null;
}
