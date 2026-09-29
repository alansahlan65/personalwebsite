"use client";

import { ArrowIcon } from "./ui-icons";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ProjectImageTransition } from "./project-transition";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

const projects = [
  { name: "Aurelia", category: "Hospitality", slug: "aurelia", href: "/work/aurelia" },
  { name: "Paylecta", category: "Finance", slug: "paylecta", href: "/work/paylecta" },
  { name: "PawFriend", category: "Pet adoption", slug: "pawfriend", href: "/work/pawfriend" },
  { name: "Munchpal", category: "Food sharing", slug: "munchpal", href: "/work/munchpal" },
] as const;

const MotionLink = motion.create(Link);
const layoutEase = [0.23, 1, 0.32, 1] as const;

function ProjectBanner({ slug, expanded, reducedMotion }: { slug: string; expanded: boolean; reducedMotion: boolean }) {
  const [expandedLoaded, setExpandedLoaded] = useState(false);
  const revealExpanded = expanded && expandedLoaded;
  const banner = <motion.span
    className="project-preview"
    layout
    transition={{ layout: { duration: reducedMotion ? 0 : 0.5, ease: layoutEase } }}
    aria-hidden="true"
  >
    <span className="project-preview-media">
      <Image className="project-banner-compact" src={`/images/work/${slug}-compact.webp`} fill alt=""
        sizes="(max-width: 700px) calc(100vw - 84px), (max-width: 1440px) 48vw, 670px"
        style={{ opacity: revealExpanded ? 0 : 1 }} />
      {(expanded || expandedLoaded) && <Image className="project-banner-expanded" src={`/images/work/${slug}-expanded.webp`} fill alt="" loading="eager"
        sizes="(max-width: 700px) calc(100vw - 84px), (max-width: 1600px) 85vw, 1350px"
        onLoad={() => setExpandedLoaded(true)} style={{ opacity: revealExpanded ? 1 : 0 }} />}
    </span>
  </motion.span>;

  return <ProjectImageTransition slug={slug}>{banner}</ProjectImageTransition>;
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectGallery() {
  const listRef = useRef<HTMLOListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const active = focused ?? hovered;

  useEffect(() => {
    function clearWhenPointerMovesAway(event: globalThis.PointerEvent) {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (!listRef.current?.contains(event.target as Node)) setHovered(null);
    }
    window.addEventListener("pointermove", clearWhenPointerMovesAway);
    return () => window.removeEventListener("pointermove", clearWhenPointerMovesAway);
  }, []);

  function onPreviewMove(event: PointerEvent<HTMLAnchorElement>, slug: string) {
    if ((event.pointerType === "mouse" || event.pointerType === "pen") && window.matchMedia("(hover: hover) and (pointer: fine)").matches) setHovered(slug);
  }

  function onProjectClick(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (!isPlainClick(event)) return;
    sessionStorage.setItem("selected-work-return", JSON.stringify({ slug, y: window.scrollY }));
  }

  return (
    <ol className="project-list" ref={listRef}>
      {projects.map((project, index) => (
        <motion.li className="project-row project-row--linked" key={project.slug} data-project={project.slug} data-expanded={active === project.slug}
          layout="position" transition={{ layout: { duration: reducedMotion ? 0 : 0.5, ease: layoutEase } }}>
            <MotionLink
              className="project-link"
              data-magnet="project"
              href={project.href}
              transitionTypes={["project-entry"]}
              onNavigate={() => window.dispatchEvent(new Event("portfolio:project-entry"))}
              aria-label={`${project.name}, ${project.category} case study`}
              onPointerMove={(event) => onPreviewMove(event, project.slug)}
              onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setFocused(project.slug); }}
              onBlur={() => setFocused(null)}
              onClick={(event) => onProjectClick(event, project.slug)}
            >
              <motion.span className="project-number" layout="position" aria-hidden="true" transition={{ layout: { duration: reducedMotion ? 0 : 0.5, ease: layoutEase } }}>0{index + 1}</motion.span>
              <motion.span className="project-copy" layout="position" transition={{ layout: { duration: reducedMotion ? 0 : 0.5, ease: layoutEase } }}>
                <h3 data-magnet-part>{project.name}</h3>
                <span className="project-category">{project.category}</span>
              </motion.span>
              <ProjectBanner slug={project.slug} expanded={active === project.slug} reducedMotion={reducedMotion} />
              <motion.span className="project-arrow" layout="position" aria-hidden="true" transition={{ layout: { duration: reducedMotion ? 0 : 0.5, ease: layoutEase } }}>
                <span data-magnet-part><ArrowIcon direction="right" /></span>
              </motion.span>
            </MotionLink>
        </motion.li>
      ))}
    </ol>
  );
}
