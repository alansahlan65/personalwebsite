"use client";

import { ArrowIcon } from "./ui-icons";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ProjectImageTransition } from "./project-transition";
import { useEffect, useState, type MouseEvent, type PointerEvent } from "react";

const projects = [
  { name: "Aurelia", category: "Hospitality", slug: "aurelia" },
  { name: "Paylecta", category: "Finance" },
  { name: "PawFriend", category: "Pet adoption" },
  { name: "Munchpal", category: "Food sharing" },
] as const;

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectGallery() {
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

  function onPreviewEnter(event: PointerEvent<HTMLAnchorElement>, slug: string) {
    if (event.pointerType === "mouse" || event.pointerType === "pen") setHovered(slug);
  }

  function onProjectClick(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (!isPlainClick(event)) return;
    sessionStorage.setItem("selected-work-return", JSON.stringify({ slug, y: window.scrollY }));
  }

  return (
    <ol className="project-list" onPointerLeave={() => setHovered(null)}>
      {projects.map((project, index) => (
        <li className={["project-row", "slug" in project ? "project-row--linked" : ""].join(" ")} key={project.name}>
          {"slug" in project ? (
            <Link
              className="project-link"
              data-magnet="project"
              transitionTypes={["project-entry"]}
              onNavigate={() => window.dispatchEvent(new Event("portfolio:project-entry"))}
              href={"/work/" + project.slug}
              aria-label={project.name + ", " + project.category + " case study"}
              onPointerEnter={(event) => onPreviewEnter(event, project.slug)}
              onPointerLeave={() => setHovered(null)}
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
                      src="/images/aurelia-interface.webp"
                      width={1440}
                      height={900}
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
          ) : (
            <>
              <span className="project-number" aria-hidden="true">0{index + 1}</span>
              <h3>{project.name}</h3>
              <span className="project-category">{project.category}</span>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}
