"use client";

import { useEffect, useRef } from "react";
import { ArrowIcon } from "./ui-icons";
import { TransitionLink as Link } from "./navigation-transition";

export function ContactAction() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const pressedPointer = useRef<number | null>(null);

  function releasePress() {
    pressedPointer.current = null;
    linkRef.current?.removeAttribute("data-pressed");
  }

  useEffect(() => {
    function onPointerRelease(event: PointerEvent) {
      if (event.pointerId === pressedPointer.current) releasePress();
    }
    function onVisibilityChange() {
      if (document.visibilityState === "hidden") releasePress();
    }
    window.addEventListener("pointerup", onPointerRelease);
    window.addEventListener("pointercancel", onPointerRelease);
    window.addEventListener("blur", releasePress);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pointerup", onPointerRelease);
      window.removeEventListener("pointercancel", onPointerRelease);
      window.removeEventListener("blur", releasePress);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <Link ref={linkRef} className="contact-action" href="/contact" data-magnet="control"
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        pressedPointer.current = event.pointerId;
        event.currentTarget.dataset.pressed = "true";
      }}
      onPointerLeave={releasePress} onBlur={releasePress}>
      <span data-magnet-part>Let’s work<br />together.</span>
      <span className="contact-arrow" aria-hidden="true" data-magnet-part><ArrowIcon /></span>
    </Link>
  );
}
