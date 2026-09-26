"use client";

import { ViewTransition, type ReactNode } from "react";

export function ProjectImageTransition({ children, slug }: { children: ReactNode; slug: string }) {
  return (
    <ViewTransition name={`${slug}-image`} share={{ "project-entry": "project-image", default: "none" }} default="none">
      {children}
    </ViewTransition>
  );
}
