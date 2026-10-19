"use client";

import { ArrowIcon } from "./ui-icons";
import Image from "next/image";
import { scrollInfo } from "motion";
import { motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent } from "react";

export type CaseMediaPanel = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  width: number;
  height: number;
  label?: string;
  detail?: { x: number; y: number; width: number; height: number; minDisplayWidth?: number; alt: string };
};

function scrollToMediaPanel(section: HTMLElement, panel: HTMLElement, travel: number) {
  const start = section.getBoundingClientRect().top + window.scrollY;
  // Motion measures the section's client height, excluding its borders.
  const distance = Math.max(0, section.clientHeight - window.innerHeight);
  const progress = travel > 0 ? Math.min(panel.offsetLeft, travel) / travel : 0;
  window.scrollTo({ top: Math.floor(start + progress * distance), behavior: "instant" });
}

export function CaseMediaSequence({ id, title, panels, skipTo, skipLabel }: {
  id: string;
  title: string;
  panels: readonly CaseMediaPanel[];
  skipTo: string;
  skipLabel: string;
}) {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const transform = useMotionValue("translate3d(0px, 0px, 0px)");
  const [current, setCurrent] = useState(1);
  const [horizontal, setHorizontal] = useState(false);

  useEffect(() => {
    // The document's stacked layout remains complete without observation.
    if (typeof ResizeObserver !== "function") return;
    const root = section.current!;
    const frame = viewport.current!;
    const media = track.current!;
    const query = window.matchMedia("(min-width: 1000px) and (min-height: 750px) and (prefers-reduced-motion: no-preference) and (forced-colors: none)");
    let disposed = false;
    let cancelScroll = () => {};
    let pendingFrame = 0;
    let activePanel = 1;
    let previousTravel = 0;

    const measure = () => {
      if (disposed || !root.isConnected) return;
      const wasHorizontal = root.dataset.horizontal === "true";
      const start = root.getBoundingClientRect().top + window.scrollY;
      const focused = root.contains(document.activeElement) ? document.activeElement as HTMLElement : null;
      const focusedPanel = focused?.closest<HTMLElement>(".case-media-panel");
      const focusedSkip = focused?.matches(".case-media-skip");
      const readingHorizontal = wasHorizontal && window.scrollY >= start && window.scrollY <= start + previousTravel;
      const visiblePanel = Array.from(media.children).find((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      }) as HTMLElement | undefined;
      const anchor = focusedPanel ?? (focusedSkip || readingHorizontal ? media.children[activePanel - 1] as HTMLElement : visiblePanel);
      cancelScroll();
      root.style.setProperty("--media-panel-width", `${frame.clientWidth}px`);
      root.dataset.horizontal = query.matches ? "true" : "false";
      const travel = Math.max(0, media.scrollWidth - frame.clientWidth);
      const fits = media.scrollHeight <= frame.clientHeight + 1;
      const horizontal = query.matches && fits && travel > 0;
      root.dataset.horizontal = horizontal ? "true" : "false";
      setHorizontal(horizontal);
      root.style.setProperty("--media-travel", `${horizontal ? travel : 0}px`);
      if (focused && !focusedPanel && !focusedSkip) {
        focused.scrollIntoView({ block: "nearest", behavior: "instant" });
      } else if (anchor && (focusedPanel || wasHorizontal !== horizontal)) {
        if (horizontal) scrollToMediaPanel(root, anchor, travel);
        else (focusedPanel ? focused! : anchor).scrollIntoView({ block: focusedPanel ? (wasHorizontal ? "center" : "nearest") : "start", behavior: "instant" });
      }
      previousTravel = horizontal ? travel : 0;
      if (!horizontal) {
        transform.set("translate3d(0px, 0px, 0px)");
        return;
      }
      cancelScroll = scrollInfo(({ y }) => {
        // A media-query change can precede the ResizeObserver's next frame.
        if (!query.matches || root.dataset.horizontal !== "true") return;
        transform.set(`translate3d(${-y.progress * travel}px, 0px, 0px)`);
        const next = Math.round(y.progress * (panels.length - 1)) + 1;
        if (next !== activePanel) { activePanel = next; setCurrent(next); }
      }, { target: root, offset: ["start start", "end end"] });
    };
    const revealFragment = () => {
      let fragment: string;
      try { fragment = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(fragment);
      const panel = target?.closest<HTMLElement>(".case-media-panel");
      if (!target || !panel || !root.contains(panel)) return;
      if (root.dataset.horizontal === "true") scrollToMediaPanel(root, panel, previousTravel);
      else target.scrollIntoView({ block: "start", behavior: "instant" });
    };
    const scheduleMeasure = () => {
      if (disposed) return;
      cancelAnimationFrame(pendingFrame);
      pendingFrame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(frame);
    observer.observe(media);
    query.addEventListener("change", scheduleMeasure);
    window.addEventListener("resize", scheduleMeasure);
    document.fonts.addEventListener("loadingdone", scheduleMeasure);
    document.fonts.ready.then(scheduleMeasure);
    media.addEventListener("load", scheduleMeasure, true);
    window.addEventListener("hashchange", revealFragment);
    window.addEventListener("popstate", revealFragment);
    measure();
    revealFragment();
    return () => {
      disposed = true;
      cancelScroll();
      cancelAnimationFrame(pendingFrame);
      observer.disconnect();
      query.removeEventListener("change", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      document.fonts.removeEventListener("loadingdone", scheduleMeasure);
      media.removeEventListener("load", scheduleMeasure, true);
      window.removeEventListener("hashchange", revealFragment);
      window.removeEventListener("popstate", revealFragment);
    };
  }, [panels.length, transform]);

  function revealFocusedPanel(event: FocusEvent<HTMLElement>) {
    const root = section.current;
    const panel = (event.target as HTMLElement).closest<HTMLElement>(".case-media-panel");
    if (!root || !panel || root.dataset.horizontal !== "true") return;
    const travel = track.current!.scrollWidth - viewport.current!.clientWidth;
    scrollToMediaPanel(root, panel, travel);
  }

  function selectPanel(event: MouseEvent<HTMLAnchorElement>, index: number) {
    const root = section.current;
    if (!root || root.dataset.horizontal !== "true" || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const heading = document.getElementById(`${id}-${panels[index].id}`)!;
    if (window.location.hash !== new URL(event.currentTarget.href).hash) window.history.pushState(window.history.state, "", event.currentTarget.href);
    heading.focus({ preventScroll: true });
    scrollToMediaPanel(root, heading.closest<HTMLElement>(".case-media-panel")!, track.current!.scrollWidth - viewport.current!.clientWidth);
  }

  return (
    <section className="case-media" id={id} aria-labelledby={`${id}-title`} ref={section} onFocusCapture={revealFocusedPanel}>
      <a className="case-media-skip" href={`#${skipTo}`} data-magnet="text"><span data-magnet-part>{skipLabel}</span> <span data-magnet-part aria-hidden="true"><ArrowIcon direction="down" /></span></a>
      <div className="case-media-pin">
        <div className="case-media-toolbar page-width">
          <div className="case-media-heading"><h2 id={`${id}-title`}>{title}</h2></div>
          <div className="case-media-controls">
            <div className="case-media-progress"><span aria-hidden="true">0{current} / 0{panels.length}</span><progress aria-label="Media sequence progress" max={panels.length} value={current} /></div>
          </div>
        </div>
        <nav className="case-media-panel-nav page-width" aria-label={`${title} views`}>
          <ol>{panels.map((panel, index) => <li key={panel.id}><a href={`#${id}-${panel.id}`} onClick={(event) => selectPanel(event, index)} aria-current={horizontal && current === index + 1 ? "location" : undefined} data-pointer-feedback="local"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{panel.label ?? panel.title}</a></li>)}</ol>
        </nav>
        <div className="case-media-viewport page-width" ref={viewport}>
          <motion.div className="case-media-track" ref={track} style={{ transform }}>
            {panels.map((panel) => (
              <article className="case-media-panel" key={panel.id} aria-labelledby={`${id}-${panel.id}`}>
                <div className="case-media-copy"><h3 id={`${id}-${panel.id}`} tabIndex={-1}>{panel.title}</h3><p>{panel.description}</p></div>
                <figure>
                  {panel.detail ? <div className="case-media-detail-viewport" data-portrait={panel.detail.height > panel.detail.width || undefined} data-pan={panel.detail.width > 400 || undefined} tabIndex={panel.detail.width > 400 ? 0 : undefined} role={panel.detail.width > 400 ? "group" : undefined} aria-label={panel.detail.width > 400 ? `${panel.label ?? panel.title} screenshot detail` : undefined}>
                    <div className="case-media-crop" style={{
                      aspectRatio: `${panel.detail.width} / ${panel.detail.height}`,
                      "--crop-aspect": panel.detail.width / panel.detail.height,
                      "--crop-min-width": `${panel.detail.minDisplayWidth ?? Math.min(panel.detail.width, 600)}px`,
                      "--crop-max-width": `${Math.max(320, panel.detail.width * 2)}px`,
                      "--crop-width": `${panel.width / panel.detail.width * 100}%`,
                      "--crop-height": `${panel.height / panel.detail.height * 100}%`,
                      "--crop-left": `${-panel.detail.x / panel.detail.width * 100}%`,
                      "--crop-top": `${-panel.detail.y / panel.detail.height * 100}%`,
                    } as CSSProperties}><Image src={panel.image} alt={panel.detail.alt} width={panel.width} height={panel.height} unoptimized /></div>
                  </div> : <Image src={panel.image} alt={panel.alt} width={panel.width} height={panel.height} sizes="(min-width: 1000px) 55vw, 90vw" />}
                  {panel.detail && panel.detail.width > 400 && <p className="case-media-pan-cue">Scroll sideways for detail.</p>}
                  <figcaption><details className="case-media-source"><summary data-pointer-feedback="local">View source image</summary><Image src={panel.image} alt={panel.alt} width={panel.width} height={panel.height} sizes="(min-width: 1000px) 55vw, 90vw" /><a href={panel.image} target="_blank" rel="noreferrer" data-magnet="text"><span data-magnet-part>Open {panel.id} screenshot</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a></details></figcaption>
                </figure>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
