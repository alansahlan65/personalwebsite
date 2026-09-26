"use client";

import Image from "next/image";
import { scrollInfo } from "motion";
import { motion, useMotionValue, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

const roles = [
  { label: "Product Designer", image: "role-ocean", offset: 0.12, direction: -1 },
  { label: "Design Engineer", image: "role-mountain", offset: 0.42, direction: 1 },
  { label: "Interaction Designer", image: "role-coast", offset: 0.26, direction: -1 },
] as const;

function RoleTrack({ role, progress }: { role: typeof roles[number]; progress: MotionValue<number> }) {
  const viewport = useRef<HTMLDivElement>(null);
  const unit = useRef<HTMLDivElement>(null);
  const transform = useMotionValue("translate3d(0px, 0px, 0px)");
  const [copies, setCopies] = useState(4);

  useEffect(() => {
    const frame = viewport.current!;
    const phrase = unit.current!;
    let disposed = false;
    let unitWidth = 0;
    let travel = 0;
    const update = () => {
      const start = -unitWidth * role.offset - (role.direction === 1 ? travel : 0);
      transform.set(`translate3d(${start + role.direction * progress.get() * travel}px, 0px, 0px)`);
    };
    const measure = () => {
      if (disposed) return;
      unitWidth = phrase.getBoundingClientRect().width;
      travel = Math.min(frame.clientWidth * 0.32, 460);
      if (unitWidth) setCopies(Math.ceil((frame.clientWidth + travel) / unitWidth) + 2);
      update();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    observer.observe(phrase);
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
      <motion.div className="role-track" style={{ transform }}>
        {Array.from({ length: copies }, (_, index) => (
          <div className="role-unit" key={index} ref={index === 0 ? unit : undefined} aria-hidden={index === 0 ? undefined : true}>
            {index === 0 ? <p>{role.label}</p> : <span>{role.label}</span>}
            <Image src={`/images/${role.image}.webp`} alt="" width={800} height={360}
              sizes="(max-width: 650px) 120px, 260px" />
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
