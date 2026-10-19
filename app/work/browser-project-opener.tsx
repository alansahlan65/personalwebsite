"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ProjectImageTransition } from "../components/project-transition";
import styles from "./project-opener.module.css";

const subscribe = () => () => {};

type BrowserProjectOpenerProps = {
  slug: string;
  projectName: string;
  durationSeconds: number;
  description: string;
  poster?: { image: string; width: number; height: number };
};

export function BrowserProjectOpener({ slug, projectName, durationSeconds, description, poster }: BrowserProjectOpenerProps) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wantsPlayback = useRef(true);
  const isVisible = useRef(false);
  const restartPending = useRef(false);
  const ready = useRef(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [present, setPresent] = useState(false);
  const [failed, setFailed] = useState(false);
  const demo = `/demos/${slug}`;
  const descriptionId = `${slug}-tour-description`;

  const command = useCallback((type: string, extra: Record<string, boolean> = {}) => {
    frameRef.current?.contentWindow?.postMessage({ source: "portfolio-composition", type, ...extra }, window.location.origin);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    wantsPlayback.current = !preference.matches && !forcedColors.matches;

    function syncPlayback() {
      if (wantsPlayback.current && isVisible.current && !document.hidden) {
        setLoaded(true);
        command("play");
      } else {
        command("pause");
      }
    }

    function onPreferenceChange() {
      if (preference.matches || forcedColors.matches) {
        wantsPlayback.current = false;
        restartPending.current = true;
        command("pause");
        command("poster");
        setPresent(false);
      }
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow || event.data?.source !== "aurelia-composition") return;
      if (event.data.type === "ready") {
        ready.current = true;
        if (loadTimer.current) clearTimeout(loadTimer.current);
        setFailed(false);
        if (restartPending.current) {
          restartPending.current = false;
          command("restart", { play: wantsPlayback.current && isVisible.current && !document.hidden });
        } else {
          syncPlayback();
        }
      }
      if (event.data.type === "ready" || event.data.type === "state") {
        setPlaying(event.data.playing === true);
        if (event.data.playing) setPresent(true);
      }
    }

    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => {
      isVisible.current = entry.intersectionRatio >= 0.15;
      syncPlayback();
    }, { threshold: 0.15 }) : null;
    observer?.observe(container);
    if (!observer) {
      isVisible.current = true;
      wantsPlayback.current = false;
    }
    preference.addEventListener("change", onPreferenceChange);
    forcedColors.addEventListener("change", onPreferenceChange);
    document.addEventListener("visibilitychange", syncPlayback);
    window.addEventListener("message", onMessage);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      forcedColors.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", syncPlayback);
      window.removeEventListener("message", onMessage);
      command("pause");
      if (loadTimer.current) clearTimeout(loadTimer.current);
    };
  }, [command]);

  function togglePlayback() {
    if (playing) {
      wantsPlayback.current = false;
      command("pause");
    } else {
      wantsPlayback.current = true;
      if (!loaded) restartPending.current = true;
      setLoaded(true);
      if (loaded && ready.current && restartPending.current) {
        restartPending.current = false;
        command("restart");
      } else {
        command("play");
      }
    }
  }

  function replay() {
    wantsPlayback.current = true;
    restartPending.current = !loaded;
    setLoaded(true);
    command("restart");
  }

  return (
    <figure className={`case-hero ${styles.opener}`} aria-label={`${projectName} product tour`}>
      <ProjectImageTransition slug={slug}>
        <div ref={containerRef} className={`${styles.frame} ${styles.compositionFrame}`}>
          <Image src={poster?.image ?? `${demo}/poster.webp`} width={poster?.width ?? 1920} height={poster?.height ?? 1080} unoptimized loading="eager" fetchPriority="high"
            alt={`${projectName}. Come for Bali. Stay for the house.`} className={styles.compositionPoster} data-complete={Boolean(poster)} />
          {loaded && enhanced && <iframe ref={frameRef} src={`${demo}/index.html?embed=1`}
            title={`${durationSeconds}-second ${projectName} product tour`} aria-describedby={descriptionId}
            className={styles.composition} data-present={present && !failed} tabIndex={-1}
            onLoad={() => {
              command("status");
              if (!ready.current) loadTimer.current = setTimeout(() => { setFailed(true); setPlaying(false); }, 12000);
            }} onError={() => { setFailed(true); setPlaying(false); }} />}
        </div>
      </ProjectImageTransition>
      <figcaption className={styles.caption}>
        <p id={descriptionId}>{description}</p>
        <div className={styles.controls} hidden={!enhanced || failed}>
          <button type="button" onClick={togglePlayback} data-pointer-feedback="local" aria-label={`${playing ? "Pause" : "Play"} ${projectName} product tour`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">{playing ? <path d="M8 5v14M16 5v14" /> : <path d="m8 5 11 7-11 7Z" />}</svg>
            {playing ? "Pause" : "Play"}
          </button>
          <button type="button" onClick={replay} data-pointer-feedback="local" aria-label={`Replay ${projectName} product tour`}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8a8 8 0 1 1-1 6M5 3v5h5" /></svg>Replay
          </button>
        </div>
        <noscript><a href={`${demo}/index.html`}>Open the {projectName} motion composition</a></noscript>
        {failed && <p role="status">The motion composition could not load. <a href={`${demo}/index.html`} data-pointer-feedback="local">Open the motion composition</a>.</p>}
      </figcaption>
    </figure>
  );
}
