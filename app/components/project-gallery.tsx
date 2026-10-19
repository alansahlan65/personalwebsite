"use client";

import { ArrowIcon } from "./ui-icons";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ProjectImageTransition } from "./project-transition";
import { useState, type MouseEvent, type PointerEvent } from "react";
import { writeSessionValue } from "../lib/session-storage";

const projects = [
  { name: "Aurelia", category: "Hospitality", slug: "aurelia", href: "/work/aurelia", description: "I designed and built a Bali stay-finding concept with trip filters, practical stay details and editable requests." },
  { name: "Paylecta", category: "Finance", slug: "paylecta", href: "/work/paylecta", description: "I designed desktop and mobile finance dashboards for merchants to manage customers, invoices and payouts." },
  { name: "PawFriend", category: "Pet adoption", slug: "pawfriend", href: "/work/pawfriend", description: "I designed and built an adoption concept for comparing pets, saving a shortlist and preparing for a first visit." },
  { name: "Munchpal", category: "Food sharing", slug: "munchpal", href: "/work/munchpal", description: "I researched, designed and tested a food-sharing prototype for Surabaya residents and volunteers, with separate flows for meals and bulk donations." },
] as const;

const layoutEase = [0.23, 1, 0.32, 1] as const;

function layoutTransition(instant: boolean) {
  return { layout: { duration: instant ? 0 : 0.28, ease: layoutEase } };
}

function ProjectCover({ slug, instant }: { slug: string; instant: boolean }) {
  const cover = <motion.span
    className="project-preview"
    layout
    transition={layoutTransition(instant)}
    aria-hidden="true"
  >
    <span className="project-preview-media">
      <Image className="project-cover" src={`/images/work/${slug}-expanded.webp`} fill alt=""
        sizes="(max-width: 700px) calc(100vw - 84px), (max-width: 1600px) 85vw, 1350px" />
    </span>
  </motion.span>;

  return <ProjectImageTransition slug={slug}>{cover}</ProjectImageTransition>;
}

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function ProjectGallery() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [input, setInput] = useState<"pointer" | "keyboard">("pointer");
  const reducedMotion = useReducedMotion() ?? false;
  const active = focused ?? hovered;
  const instant = reducedMotion || input === "keyboard";
  const transition = layoutTransition(instant);

  function onPreviewMove(event: PointerEvent<HTMLAnchorElement>, slug: string) {
    if ((event.pointerType === "mouse" || event.pointerType === "pen") && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      if (input !== "pointer") setInput("pointer");
      if (hovered !== slug) setHovered(slug);
    }
  }

  function onProjectClick(event: MouseEvent<HTMLAnchorElement>, slug: string) {
    if (!isPlainClick(event)) return;
    writeSessionValue("selected-work-return", JSON.stringify({ slug, y: window.scrollY }));
  }

  return (
    <>
      <noscript><style>{".project-row .project-description { display: block; }"}</style></noscript>
      <ol className="project-list" data-input={input} onPointerLeave={() => setHovered(null)}>
        {projects.map((project, index) => (
          <motion.li className="project-row" key={project.slug} data-project={project.slug} data-expanded={active === project.slug}
            layout="position" transition={transition}>
              <Link
                className="project-link"
                data-magnet="project"
                href={project.href}
                transitionTypes={["project-entry"]}
                onNavigate={() => window.dispatchEvent(new Event("portfolio:project-entry"))}
                aria-label={`${project.name}, ${project.category} case study`}
                aria-describedby={`project-description-${project.slug}`}
                onPointerMove={(event) => onPreviewMove(event, project.slug)}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) {
                    setInput("keyboard");
                    setFocused(project.slug);
                  }
                }}
                onBlur={() => setFocused(null)}
                onClick={(event) => onProjectClick(event, project.slug)}
              >
                <motion.span className="project-number" layout="position" aria-hidden="true" transition={transition}>0{index + 1}</motion.span>
                <motion.span className="project-copy" layout="position" transition={transition}>
                  <h3 data-magnet-part>{project.name}</h3>
                  <span className="project-category">{project.category}</span>
                </motion.span>
                <ProjectCover slug={project.slug} instant={instant} />
                <p className="project-description" id={`project-description-${project.slug}`}>{project.description}</p>
                <motion.span className="project-arrow" layout="position" aria-hidden="true" transition={transition}>
                  <span data-magnet-part><ArrowIcon direction="right" /></span>
                </motion.span>
              </Link>
          </motion.li>
        ))}
      </ol>
    </>
  );
}
