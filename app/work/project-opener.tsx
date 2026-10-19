"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ProjectImageTransition } from "../components/project-transition";
import styles from "./project-opener.module.css";
import { BrowserProjectOpener } from "./browser-project-opener";

const subscribe = () => () => {};

type ProjectOpenerProps = {
  slug: string;
  projectName: string;
  durationSeconds: number;
  description: string;
  composition?: boolean;
  poster?: { image: string; width: number; height: number };
};

export function ProjectOpener(props: ProjectOpenerProps) {
  return props.composition ? <BrowserProjectOpener {...props} /> : <VideoProjectOpener {...props} />;
}

function VideoProjectOpener({ slug, projectName, durationSeconds, description }: ProjectOpenerProps) {
  const enhanced = useSyncExternalStore(subscribe, () => true, () => false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const wantsPlayback = useRef(true);
  const isVisible = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const demo = `/demos/${slug}`;
  const descriptionId = `${slug}-tour-description`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    wantsPlayback.current = !preference.matches && !forcedColors.matches;

    function syncPlayback() {
      if (!video) return;
      if (wantsPlayback.current && isVisible.current && !document.hidden) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    }

    function onPreferenceChange() {
      if ((preference.matches || forcedColors.matches) && video) {
        wantsPlayback.current = false;
        video.pause();
        if (video.readyState > 0) video.currentTime = 0;
      }
    }

    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => {
      isVisible.current = entry.intersectionRatio >= 0.15;
      syncPlayback();
    }, { threshold: 0.15 }) : null;
    observer?.observe(video);
    if (!observer) {
      // Manual play remains available without automatic viewport tracking.
      isVisible.current = true;
      wantsPlayback.current = false;
    }
    preference.addEventListener("change", onPreferenceChange);
    forcedColors.addEventListener("change", onPreferenceChange);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      forcedColors.removeEventListener("change", onPreferenceChange);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      wantsPlayback.current = true;
      void video.play().catch(() => {});
    } else {
      wantsPlayback.current = false;
      video.pause();
    }
  }

  function replay() {
    const video = videoRef.current;
    if (!video) return;
    wantsPlayback.current = true;
    video.currentTime = 0;
    void video.play().catch(() => {});
  }

  return (
    <figure className={`case-hero ${styles.opener}`} aria-label={`${projectName} product tour`}>
      <ProjectImageTransition slug={slug}>
        <div className={styles.frame}>
          <video ref={videoRef} width={1920} height={1080} muted playsInline loop
            controls={!enhanced} preload="none" poster={`${demo}/poster.webp`}
            aria-label={`${durationSeconds}-second ${projectName} product tour`} aria-describedby={descriptionId}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
            <source src={`${demo}/${slug}-opener.mp4`} type="video/mp4" />
            <a href={`${demo}/${slug}-opener.mp4`} data-pointer-feedback="local">Watch the {projectName} product tour</a>
          </video>
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
        {failed && <p role="status">The video could not load. <a href={`${demo}/${slug}-opener.mp4`} data-pointer-feedback="local">Open the product tour</a>.</p>}
      </figcaption>
    </figure>
  );
}
