"use client";

import { ArrowIcon } from "./ui-icons";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ProjectImageTransition } from "./project-transition";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

const projects = [
  { name: "Aurelia", category: "Hospitality", slug: "aurelia" },
  { name: "Paylecta", category: "Finance", slug: "paylecta" },
  { name: "PawFriend", category: "Pet adoption", slug: "pawfriend" },
  { name: "Munchpal", category: "Food sharing", slug: "munchpal" },
] as const;

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectGallery() {
  const listRef = useRef<HTMLOListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const active = focused ?? hovered;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    onChange();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    function clearWhenPointerMovesAway(event: globalThis.PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (!listRef.current?.contains(event.target as Node)) setHovered(null);
    }
    window.addEventListener("pointermove", clearWhenPointerMovesAway);
    return () => window.removeEventListener("pointermove", clearWhenPointerMovesAway);
  }, []);

  function onPreviewMove(event: PointerEvent<HTMLAnchorElement>, slug: string) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") setHovered(slug);
  }

  function onProjectClick(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (!isPlainClick(event)) return;
    sessionStorage.setItem("selected-work-return", JSON.stringify({ slug, y: window.scrollY }));
  }

  return (
    <ol className="project-list" ref={listRef}>
      {projects.map((project, index) => (
        <li className="project-row project-row--linked" key={project.name} data-project={project.name.toLowerCase()} data-expanded={active === project.slug}>
          {(
            <Link
              className="project-link"
              data-magnet="project"
              transitionTypes={["project-entry"]}
              onNavigate={() => window.dispatchEvent(new Event("portfolio:project-entry"))}
              href={"/work/" + project.slug}
              aria-label={project.name + ", " + project.category + " case study"}
              onPointerMove={(event) => onPreviewMove(event, project.slug)}
              onFocus={() => setFocused(project.slug)}
              onBlur={() => setFocused(null)}
              onClick={(event) => onProjectClick(event, project.slug)}
            >
              <span className="project-number" aria-hidden="true">0{index + 1}</span>
              <h3 data-magnet-part>{project.name}</h3>
              <motion.span
                className="project-preview"
                initial={false}
                animate={{ width: active === project.slug ? "auto" : 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
              >
                <ProjectImageTransition slug={project.slug}>
                  <span className="project-preview-media">
                    <Image
                      src={project.slug === "paylecta" ? "/images/paylecta-cover.webp" : project.slug === "pawfriend" ? "/images/pawfriend-interface.webp" : project.slug === "munchpal" ? "/images/munchpal-cover.webp" : "/images/aurelia-interface.webp"}
                      width={project.slug === "paylecta" ? 1402 : 1440}
                      height={project.slug === "paylecta" ? 1081 : project.slug === "munchpal" ? 810 : 900}
                      alt=""
                      loading="eager"
                      sizes="(max-width: 700px) calc(100vw - 80px), (max-width: 1200px) 22vw, 320px"
                    />
                  </span>
                </ProjectImageTransition>
              </motion.span>
              <span className="project-category">{project.category}</span>
              <span className="project-arrow" aria-hidden="true" data-magnet-part><ArrowIcon /></span>
            </Link>
          )}
        </li>
      ))}
    </ol>
  );
}
