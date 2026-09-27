import type { ReactNode } from "react";

export function PageTransition({ name, children }: { name: string; children: ReactNode }) {
  return <div data-page-transition={name}>{children}</div>;
}
