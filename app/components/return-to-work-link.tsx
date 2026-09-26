"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

function rememberReturn(event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  sessionStorage.setItem("selected-work-return-pending", "1");
}

export function ReturnToWorkLink({ className }: { className?: string }) {
  return (
    <Link className={className} href="/#work" scroll={false} onClick={rememberReturn} data-magnet="text">
      <span data-magnet-part>Back to selected work</span> <span data-magnet-part aria-hidden="true">↗</span>
    </Link>
  );
}