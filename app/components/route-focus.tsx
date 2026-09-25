"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function RouteFocus() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const hashTarget = window.location.hash
      ? document.getElementById(window.location.hash.slice(1))
      : null;
    const destination = hashTarget ?? document.querySelector<HTMLElement>("main h1");
    destination?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
