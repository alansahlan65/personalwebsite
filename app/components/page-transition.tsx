import type { ReactNode } from "react";
import { PageMotion } from "./page-motion";

export function PageTransition({ name, children }: { name: string; children: ReactNode }) {
  return <div data-page-transition={name}>{children}<PageMotion name={name} /></div>;
}
