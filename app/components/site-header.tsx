"use client";

import Image from "next/image";
import { TransitionLink as Link } from "./navigation-transition";
import { AnimatePresence, motion } from "motion/react";
import { ArrowIcon, MenuIcon } from "./ui-icons";
import { RESUME_HREF } from "../lib/portfolio-links";
import { STAIRS_MOTION } from "../lib/stairs-motion";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

type MenuPhase = "closed" | "opening" | "open" | "closing";
type HeaderMode = "full" | "compact";

const HEADER_COMPACT_AT = 96;
const HEADER_FULL_AT = 48;

const primaryLinks = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" },
] as const;

const professionalLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muhammadsahlanshadiq/" },
  { label: "GitHub", href: "https://github.com/alansahlan65" },
  { label: "Behance", href: "https://www.behance.net/muhammadsahlanshadiq" },
] as const;

function isPlainClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function MenuControlContent({ label = "Menu", icon = "menu", reducedMotion = false, static: isStatic = false }: {
  label?: string;
  icon?: "menu" | "close";
  reducedMotion?: boolean;
  static?: boolean;
}) {
  return <span className="menu-control-visual" data-press-static={isStatic ? "true" : undefined}>
    <span className="menu-control-label" data-magnet-part>{label}</span>
    <span data-magnet-part className="menu-trigger-icon" aria-hidden="true">
      {reducedMotion ? <MenuIcon kind={icon} /> : <AnimatePresence initial={false}>
        <motion.span className="menu-icon-layer" key={icon}
          initial={{ opacity: 0, transform: "scale(.95)" }}
          animate={{ opacity: 1, transform: "scale(1)" }}
          exit={{ opacity: 0, transform: "scale(.95)" }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}>
          <MenuIcon kind={icon} />
        </motion.span>
      </AnimatePresence>}
    </span>
  </span>;
}

export function SiteHeader({ page }: { page: "home" | "about" | "work" }) {
  const [mode, setMode] = useState<HeaderMode>("full");
  const [phase, setPhase] = useState<MenuPhase>("closed");
  const [reducedMotion, setReducedMotion] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const compactTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const scrollBeforeOpen = useRef(0);
  const restoreScroll = useRef(true);
  const restoreFocus = useRef(true);
  const openedOnce = useRef(false);
  const completedPanels = useRef(new Set<number>());

  const updateMode = useCallback(() => {
    if (phase !== "closed" || headerRef.current?.querySelector(":focus-visible") || compactTriggerRef.current?.matches(":focus-visible")) return;
    const y = window.scrollY;
    setMode((current) => {
      if (current === "full" && y > HEADER_COMPACT_AT) return "compact";
      if (current === "compact" && y < HEADER_FULL_AT) return "full";
      return current;
    });
  }, [phase]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    onChange();
    if (compactTriggerRef.current) compactTriggerRef.current.dataset.menuReady = "true";
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    updateMode();
    window.addEventListener("scroll", updateMode, { passive: true });
    window.addEventListener("pageshow", updateMode);
    window.addEventListener("popstate", updateMode);
    return () => {
      window.removeEventListener("scroll", updateMode);
      window.removeEventListener("pageshow", updateMode);
      window.removeEventListener("popstate", updateMode);
    };
  }, [updateMode]);

  useEffect(() => {
    completedPanels.current.clear();
  }, [phase]);

  useEffect(() => {
    if (!reducedMotion || (phase !== "opening" && phase !== "closing")) return;
    const frame = requestAnimationFrame(() => setPhase((current) => current === phase ? phase === "opening" ? "open" : "closed" : current));
    return () => cancelAnimationFrame(frame);
  }, [phase, reducedMotion]);

  const menuActive = phase !== "closed";
  const menuClosing = phase === "closing";
  useEffect(() => { window.dispatchEvent(new Event("portfolio:menu-change")); }, [menuActive, menuClosing]);
  useEffect(() => {
    if (!menuActive) return;
    const y = scrollBeforeOpen.current;
    const previousStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };
    const background = Array.from(document.querySelectorAll<HTMLElement>(".skip-link, .site-header, .compact-menu-trigger, main, footer"));
    const priorInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    document.body.style.position = "fixed";
    document.body.style.top = "-" + y + "px";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    return () => {
      background.forEach((element, index) => { element.inert = priorInert[index]; });
      Object.assign(document.body.style, previousStyles);
      if (restoreScroll.current) window.scrollTo(0, y);
    };
  }, [menuActive]);

  useEffect(() => {
    if ((phase === "opening" || (phase === "open" && reducedMotion)) && !dialogRef.current?.contains(document.activeElement)) closeRef.current?.focus();
    if (phase === "closed" && openedOnce.current) {
      if (restoreFocus.current) triggerRef.current?.focus({ preventScroll: true });
      updateMode();
    }
  }, [phase, reducedMotion, updateMode]);

  function openMenu(trigger?: HTMLButtonElement) {
    if (phase === "opening" || phase === "open") return;
    if (phase === "closed") {
      scrollBeforeOpen.current = window.scrollY;
      triggerRef.current = trigger ?? null;
      openedOnce.current = true;
    }
    restoreScroll.current = true;
    restoreFocus.current = true;
    setPhase(reducedMotion ? "open" : "opening");
  }

  function closeMenu(navigating = false) {
    restoreScroll.current = !navigating;
    restoreFocus.current = !navigating;
    setPhase(navigating || reducedMotion ? "closed" : "closing");
  }

  useEffect(() => {
    const beforeNavigation = () => {
      restoreScroll.current = false;
      restoreFocus.current = false;
      setPhase("closed");
    };
    window.addEventListener("portfolio:before-navigation", beforeNavigation);
    return () => window.removeEventListener("portfolio:before-navigation", beforeNavigation);
  }, []);

  function onNavigationClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainClick(event) || event.currentTarget.target === "_blank") return;
    const destination = new URL(event.currentTarget.href);
    const staysOnPage = destination.pathname === window.location.pathname && destination.origin === window.location.origin;
    const leavesDocument = !event.currentTarget.hasAttribute("download") && destination.protocol !== "mailto:";
    if (!staysOnPage && destination.origin === window.location.origin && leavesDocument) return;
    closeMenu(leavesDocument);
    if (staysOnPage && leavesDocument) {
      const target = destination.hash ? document.getElementById(decodeURIComponent(destination.hash.slice(1))) : document.querySelector<HTMLElement>("main h1");
      window.setTimeout(() => target?.focus({ preventScroll: true }), 0);
    }
  }

  function onDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <a className="skip-link" href="#main" data-magnet="text"><span data-magnet-part>Skip to content</span></a>
      <header
        ref={headerRef}
        className={["site-header page-width", mode === "compact" ? "site-header--compact" : ""].join(" ")}
        inert={mode === "compact"}
        onBlurCapture={() => requestAnimationFrame(updateMode)}
      >
        <Link className="brand" href="/" aria-label="Alan Sahlan, home" data-magnet="text">
          <Image src="/images/alan-logo.png" width={52} height={52} alt="" data-magnet-part />
          <span data-magnet-part>Alan Sahlan</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={onNavigationClick} aria-current={link.label === "About" && page === "about" ? "page" : undefined} data-magnet="text"><span data-magnet-part>{link.label}</span></Link>
          ))}
          <a href={RESUME_HREF} download="Alan-Sahlan-Resume.pdf" data-magnet="text"><span data-magnet-part>Resume</span></a>
        </nav>
      </header>
      <button ref={compactTriggerRef} onBlur={() => requestAnimationFrame(updateMode)} className={["compact-menu-trigger", mode === "compact" && phase === "closed" ? "is-visible" : ""].join(" ")} type="button" onClick={(event) => openMenu(event.currentTarget)} aria-label="Open menu" aria-haspopup="dialog" tabIndex={mode === "compact" && phase === "closed" ? 0 : -1} data-magnet="control">
        <MenuControlContent />
      </button>
      {menuActive && (
        <div className={["stairs-menu", phase === "closing" ? "stairs-menu--closing" : ""].join(" ")} data-phase={phase} role="dialog" aria-modal="true" aria-label="Navigation menu" ref={dialogRef} onKeyDown={onDialogKeyDown}>
          <div className="stairs-panels" aria-hidden="true">
            <motion.div className="stairs-scrim" initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: phase === "closing" ? 0 : STAIRS_MOTION.backdropOpacity }}
              transition={{ duration: reducedMotion ? 0 : STAIRS_MOTION.backdrop / 1000, ease: STAIRS_MOTION.ease }} />
            {Array.from({ length: STAIRS_MOTION.count }, (_, index) => (
              <motion.div
                className="stairs-panel"
                key={index}
                initial={reducedMotion ? false : { transform: STAIRS_MOTION.hidden }}
                animate={{ transform: phase === "closing" ? STAIRS_MOTION.hidden : STAIRS_MOTION.visible }}
                transition={{ duration: reducedMotion ? 0 : (phase === "closing" ? STAIRS_MOTION.exit : STAIRS_MOTION.enter) / 1000, delay: reducedMotion ? 0 : (phase === "closing" ? STAIRS_MOTION.count - 1 - index : index) * STAIRS_MOTION.stagger / 1000, ease: STAIRS_MOTION.ease }}
                onAnimationComplete={(definition) => {
                  if (phase !== "opening" && phase !== "closing") return;
                  const target = phase === "closing" ? STAIRS_MOTION.hidden : STAIRS_MOTION.visible;
                  if (typeof definition !== "object" || !("transform" in definition) || definition.transform !== target) return;
                  completedPanels.current.add(index);
                  if (completedPanels.current.size === STAIRS_MOTION.count) {
                    setPhase((current) => current === phase ? phase === "opening" ? "open" : "closed" : current);
                  }
                }}
              />
            ))}
          </div>
          <div className="stairs-content page-width">
            <div className="stairs-topline"><span>Alan Sahlan</span><button ref={closeRef} className="stairs-close" type="button" onClick={() => phase === "closing" ? openMenu() : closeMenu()} aria-label={phase === "closing" ? "Reopen menu" : "Close menu"} data-magnet="control"><MenuControlContent label={phase === "closing" ? "Open" : "Close"} icon={phase === "closing" ? "menu" : "close"} reducedMotion={reducedMotion} /></button></div>
            <nav className="stairs-nav" aria-label="Menu">
              {primaryLinks.map((link, index) => (
                <Link className="stairs-link" key={link.label} href={link.href} aria-label={link.label} onClick={onNavigationClick} aria-current={link.label === "About" && page === "about" ? "page" : undefined} data-magnet="text">
                  <span className="stairs-index" aria-hidden="true">0{index + 1}</span>
                  <span className="stairs-static-label" data-magnet-part>{link.label}</span>
                  <span className="stairs-marquee" aria-hidden="true"><span className="stairs-marquee-magnet" data-magnet-part>{Array.from({ length: 4 }, (_, repeat) => <span className="stairs-marquee-item" key={repeat}>{link.label}<Image src="/images/alan-logo.png" width={48} height={48} alt="" /></span>)}</span></span>
                  <span className="stairs-arrow" aria-hidden="true" data-magnet-part><ArrowIcon /></span>
                </Link>
              ))}
              <a className="stairs-link" href={RESUME_HREF} download="Alan-Sahlan-Resume.pdf" aria-label="Download resume" onClick={onNavigationClick} data-magnet="text"><span className="stairs-index" aria-hidden="true">04</span><span className="stairs-static-label" data-magnet-part>Resume</span><span className="stairs-arrow" aria-hidden="true" data-magnet-part><ArrowIcon direction="down" /></span></a>
            </nav>
            <nav className="stairs-profiles" aria-label="Professional profiles in menu">
              {professionalLinks.map((link) => <a key={link.label} href={link.href} onClick={onNavigationClick} data-magnet="text"><span data-magnet-part>{link.label}</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>)}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
