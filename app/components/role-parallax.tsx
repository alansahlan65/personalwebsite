"use client";

import Image from "next/image";
import { scrollInfo } from "motion";
import { motion, useMotionValue, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

const roles = [
  { label: "Product Designer", image: "role-feather", offset: 0.12, direction: -1 },
  { label: "Design Engineer", image: "role-monitor", offset: 0.42, direction: 1 },
  { label: "Interaction Designer", image: "role-stars", offset: 0.26, direction: -1 },
] as const;

function RoleTrack({ role, progress }: { role: typeof roles[number]; progress: MotionValue<number> }) {
  const viewport = useRef<HTMLDivElement>(null);
  const unit = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const transform = useMotionValue("translate3d(0px, 0px, 0px)");
  const [copies, setCopies] = useState(4);
  const [stationary, setStationary] = useState(false);

  useEffect(() => {
    const frame = viewport.current!;
    const phrase = unit.current!;
    const sizingLabel = label.current!;
    let disposed = false;
    let unitWidth = 0;
    let travel = 0;
    let start = 0;
    const update = () => {
      transform.set(`translate3d(${start + role.direction * progress.get() * travel}px, 0px, 0px)`);
    };
    const measure = () => {
      if (disposed || !frame.isConnected) return;
      unitWidth = phrase.getBoundingClientRect().width;
      const width = frame.clientWidth;
      const labelWidth = sizingLabel.getBoundingClientRect().width;
      const available = width - labelWidth - 48;
      const cannotFit = available < 0;
      setStationary(cannotFit);
      travel = cannotFit ? 0 : Math.min(width * 0.32, 460, available);
      // Keep the second copy's complete label inside the viewport throughout travel.
      const stagger = Math.max(0, available - travel) * role.offset;
      start = cannotFit ? 0 : -unitWidth + 24 + stagger + (role.direction === -1 ? travel : 0);
      if (unitWidth) setCopies(Math.ceil((width + travel) / unitWidth) + 2);
      update();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(phrase);
    observer.observe(sizingLabel);
    const unsubscribe = progress.on("change", update);
    measure();
    document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      disposed = true;
      observer.disconnect();
      unsubscribe();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [progress, role, transform]);

  return (
    <div className="role-viewport" ref={viewport}>
      <span className="role-measure" ref={label} aria-hidden="true">{role.label}</span>
      <motion.div className="role-track" data-stationary={stationary ? "true" : undefined} style={{ transform }}>
        {Array.from({ length: copies }, (_, index) => (
          <div className="role-unit" key={index} ref={index === 0 ? unit : undefined} aria-hidden={index === 0 ? undefined : true}>
            {index === 0 ? <p>{role.label}</p> : <span>{role.label}</span>}
            <Image className="role-icon" src={`/images/${role.image}.svg`} alt="" width={48} height={48} unoptimized />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function RoleParallax() {
  const section = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    const target = section.current!;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelScroll = () => {};
    let disposed = false;
    const connect = () => {
      cancelScroll();
      if (disposed || preference.matches) return;
      cancelScroll = scrollInfo(({ y }) => progress.set(y.progress), {
        target, offset: ["start end", "end start"],
      });
    };
    const observer = new ResizeObserver(connect);
    observer.observe(target);
    preference.addEventListener("change", connect);
    document.fonts.addEventListener("loadingdone", connect);
    document.fonts.ready.then(connect);
    connect();
    return () => {
      disposed = true;
      cancelScroll();
      observer.disconnect();
      preference.removeEventListener("change", connect);
      document.fonts.removeEventListener("loadingdone", connect);
    };
  }, [progress]);

  return (
    <section className="roles" aria-labelledby="roles-title" ref={section}>
      <div className="page-width"><h2 className="section-label" id="roles-title">Design / Build / Refine</h2></div>
      <div className="role-lines">
        {roles.map((role) => <RoleTrack key={role.label} role={role} progress={progress} />)}
      </div>
    </section>
  );
}
