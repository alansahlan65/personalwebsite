"use client";

import Image from "next/image";
import { scrollInfo } from "motion";
import { motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState, type FocusEvent } from "react";

export type CaseMediaPanel = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

function scrollToMediaPanel(section: HTMLElement, panel: HTMLElement, travel: number) {
  const start = section.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: start + Math.min(panel.offsetLeft, travel), behavior: "instant" });
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

  useEffect(() => {
    const root = section.current!;
    const frame = viewport.current!;
    const media = track.current!;
    const query = window.matchMedia("(min-width: 1000px) and (min-height: 750px) and (prefers-reduced-motion: no-preference)");
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
      const readingHorizontal = wasHorizontal && window.scrollY >= start && window.scrollY <= start + previousTravel;
      const visiblePanel = Array.from(media.children).find((panel) => {
        const rect = panel.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
      }) as HTMLElement | undefined;
      const anchor = focusedPanel ?? (readingHorizontal ? media.children[activePanel - 1] as HTMLElement : visiblePanel);
      cancelScroll();
      root.style.setProperty("--media-panel-width", `${frame.clientWidth}px`);
      root.dataset.horizontal = query.matches ? "true" : "false";
      const travel = Math.max(0, media.scrollWidth - frame.clientWidth);
      const fits = media.scrollHeight <= frame.clientHeight + 1;
      const horizontal = query.matches && fits && travel > 0;
      root.dataset.horizontal = horizontal ? "true" : "false";
      root.style.setProperty("--media-travel", `${horizontal ? travel : 0}px`);
      if (focused && !focusedPanel) {
        focused.scrollIntoView({ block: "nearest", behavior: "instant" });
      } else if (anchor && (focusedPanel || wasHorizontal !== horizontal)) {
        if (horizontal) scrollToMediaPanel(root, anchor, travel);
        else (focusedPanel ? focused! : anchor).scrollIntoView({ block: focusedPanel ? "nearest" : "start", behavior: "instant" });
      }
      previousTravel = horizontal ? travel : 0;
      if (!horizontal) {
        transform.set("translate3d(0px, 0px, 0px)");
        return;
      }
      cancelScroll = scrollInfo(({ y }) => {
        transform.set(`translate3d(${-y.progress * travel}px, 0px, 0px)`);
        const next = Math.round(y.progress * (panels.length - 1)) + 1;
        if (next !== activePanel) { activePanel = next; setCurrent(next); }
      }, { target: root, offset: ["start start", "end end"] });
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
    measure();
    return () => {
      disposed = true;
      cancelScroll();
      cancelAnimationFrame(pendingFrame);
      observer.disconnect();
      query.removeEventListener("change", scheduleMeasure);
      window.removeEventListener("resize", scheduleMeasure);
      document.fonts.removeEventListener("loadingdone", scheduleMeasure);
      media.removeEventListener("load", scheduleMeasure, true);
    };
  }, [panels.length, transform]);

  function revealFocusedPanel(event: FocusEvent<HTMLElement>) {
    const root = section.current;
    const panel = (event.target as HTMLElement).closest<HTMLElement>(".case-media-panel");
    if (!root || !panel || root.dataset.horizontal !== "true") return;
    const travel = track.current!.scrollWidth - viewport.current!.clientWidth;
    scrollToMediaPanel(root, panel, travel);
  }

  return (
    <section className="case-media" id={id} aria-labelledby={`${id}-title`} ref={section} onFocusCapture={revealFocusedPanel}>
      <div className="case-media-pin">
        <div className="case-media-toolbar page-width">
          <h2 id={`${id}-title`}>{title}</h2>
          <div className="case-media-controls">
            <div className="case-media-progress"><span aria-hidden="true">0{current} / 0{panels.length}</span><progress aria-label="Media sequence progress" max={panels.length} value={current} /></div>
            <a href={`#${skipTo}`} data-magnet="text"><span data-magnet-part>{skipLabel}</span> <span data-magnet-part aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="case-media-viewport page-width" ref={viewport}>
          <motion.div className="case-media-track" ref={track} style={{ transform }}>
            {panels.map((panel, index) => (
              <article className="case-media-panel" key={panel.id} aria-labelledby={`${id}-${panel.id}`}>
                <div className="case-media-copy"><p className="section-label">0{index + 1}</p><h3 id={`${id}-${panel.id}`}>{panel.title}</h3><p>{panel.description}</p></div>
                <figure><Image src={panel.image} alt={panel.alt} width={1440} height={900} sizes="(min-width: 1000px) 55vw, 90vw" />
                  <figcaption><span>Live concept, 26 September 2026.</span><a href={panel.image} target="_blank" rel="noreferrer" data-magnet="text"><span data-magnet-part>Open {panel.id} screenshot</span> <span data-magnet-part aria-hidden="true">↗</span></a></figcaption>
                </figure>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
