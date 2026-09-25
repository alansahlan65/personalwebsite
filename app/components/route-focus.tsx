"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function RouteFocus() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (pathname === "/" && sessionStorage.getItem("selected-work-return-pending") === "1") {
      sessionStorage.removeItem("selected-work-return-pending");
      const saved = sessionStorage.getItem("selected-work-return");
      sessionStorage.removeItem("selected-work-return");
      let y: number | null = null;
      if (saved) {
        try {
          const position = JSON.parse(saved) as { slug: string; y: number };
          if (position.slug === "aurelia" && Number.isFinite(position.y)) y = position.y;
        } catch {
          // A direct visit returns to the selected-work section start.
        }
      }
      const timeout = window.setTimeout(() => {
        const work = document.getElementById("work");
        if (y === null) work?.scrollIntoView();
        else window.scrollTo(0, y);
        work?.focus({ preventScroll: true });
      }, 100);
      return () => window.clearTimeout(timeout);
    }
    const hashTarget = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    const destination = hashTarget ?? document.querySelector<HTMLElement>("main h1");
    destination?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}