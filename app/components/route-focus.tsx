"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function RouteFocus() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const historyDestination = useRef<string | null>(null);

  useEffect(() => {
    const onPopState = () => { historyDestination.current = window.location.pathname; };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    const fromPath = previousPath.current;
    previousPath.current = pathname;
    // An entry can commit after Back has already changed the URL.
    if (window.location.pathname !== pathname) return;
    const fromHistory = historyDestination.current === pathname;
    if (fromHistory) historyDestination.current = null;
    if (pathname === "/" && sessionStorage.getItem("selected-work-return-pending") === "1") {
      sessionStorage.removeItem("selected-work-return-pending");
      const saved = sessionStorage.getItem("selected-work-return");
      sessionStorage.removeItem("selected-work-return");
      let y: number | null = null;
      if (saved) {
        try {
          const position = JSON.parse(saved) as { slug: string; y: number };
          if ((position.slug === "aurelia" || position.slug === "paylecta" || position.slug === "pawfriend" || position.slug === "munchpal") && Number.isFinite(position.y)) y = position.y;
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
    if (pathname === "/" && fromPath.startsWith("/work/") && fromHistory) {
      const frame = requestAnimationFrame(() => {
        Array.from(document.querySelectorAll<HTMLAnchorElement>(".project-link"))
          .find((link) => link.getAttribute("href") === fromPath)?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(frame);
    }
    const hashTarget = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    const destination = hashTarget ?? document.querySelector<HTMLElement>("main h1");
    destination?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}