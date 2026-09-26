"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowIcon, MenuIcon } from "./ui-icons";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

type MenuPhase = "closed" | "opening" | "open" | "closing";
type HeaderMode = "full" | "compact";

const HEADER_COMPACT_AT = 96;
const HEADER_FULL_AT = 48;
const STAIRS_DURATION_MS = 620;

const primaryLinks = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/#contact" },
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
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}>
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

  const updateMode = useCallback(() => {
    if (phase !== "closed" || headerRef.current?.contains(document.activeElement) || document.activeElement === compactTriggerRef.current) return;
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
    if (phase !== "opening" && phase !== "closing") return;
    if (reducedMotion) {
      const frame = requestAnimationFrame(() => setPhase(phase === "opening" ? "open" : "closed"));
      return () => cancelAnimationFrame(frame);
    }
    const timeout = window.setTimeout(() => setPhase(phase === "opening" ? "open" : "closed"), STAIRS_DURATION_MS);
    return () => window.clearTimeout(timeout);
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

  function onMenuLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainClick(event) || event.currentTarget.target === "_blank") return;
    const destination = new URL(event.currentTarget.href);
    const samePathHash = destination.pathname === window.location.pathname && destination.hash;
    closeMenu(true);
    if (samePathHash) {
      window.setTimeout(() => document.getElementById(decodeURIComponent(destination.hash.slice(1)))?.focus({ preventScroll: true }), 0);
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
        onBlurCapture={() => requestAnimationFrame(updateMode)}
      >
        <Link className="brand" href="/" aria-label="Alan Sahlan, home" data-magnet="text">
          <Image src="/images/alan-logo.png" width={52} height={52} alt="" data-magnet-part />
          <span data-magnet-part>Alan Sahlan</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link key={link.label} href={link.href} aria-current={link.label === "About" && page === "about" ? "page" : undefined} data-magnet="text"><span data-magnet-part>{link.label}</span></Link>
          ))}
          <span className="unavailable" aria-disabled="true" title="Resume will be added after verification">Resume</span>
        </nav>
        <button className="full-menu-trigger" type="button" onClick={(event) => openMenu(event.currentTarget)} aria-label="Open menu" aria-haspopup="dialog" data-magnet="control">
          <MenuControlContent />
        </button>
      </header>
      <button ref={compactTriggerRef} onBlur={() => requestAnimationFrame(updateMode)} className={["compact-menu-trigger", mode === "compact" && phase === "closed" ? "is-visible" : ""].join(" ")} type="button" onClick={(event) => openMenu(event.currentTarget)} aria-label="Open menu" aria-haspopup="dialog" tabIndex={mode === "compact" && phase === "closed" ? 0 : -1} data-magnet="control">
        <MenuControlContent />
      </button>
      {menuActive && (
        <div className={["stairs-menu", phase === "closing" ? "stairs-menu--closing" : ""].join(" ")} role="dialog" aria-modal="true" aria-label="Navigation menu" ref={dialogRef} onKeyDown={onDialogKeyDown}>
          <div className="stairs-panels" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <motion.div
                className="stairs-panel"
                key={index}
                initial={reducedMotion ? false : { y: "0%" }}
                animate={{ y: phase === "closing" ? "0%" : "100%" }}
                transition={{ duration: reducedMotion ? 0 : 0.38, delay: reducedMotion ? 0 : (phase === "closing" ? 4 - index : index) * 0.055, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>
          <div className="stairs-content page-width">
            <div className="stairs-topline"><span>Alan Sahlan</span><button ref={closeRef} className="stairs-close" type="button" onClick={() => phase === "closing" ? openMenu() : closeMenu()} aria-label={phase === "closing" ? "Reopen menu" : "Close menu"} data-magnet="control"><MenuControlContent label={phase === "closing" ? "Open" : "Close"} icon={phase === "closing" ? "menu" : "close"} reducedMotion={reducedMotion} /></button></div>
            <nav className="stairs-nav" aria-label="Menu">
              {primaryLinks.map((link, index) => (
                <Link className="stairs-link" key={link.label} href={link.href} aria-label={link.label} onClick={onMenuLinkClick} aria-current={link.label === "About" && page === "about" ? "page" : undefined} data-magnet="text">
                  <span className="stairs-index" aria-hidden="true">0{index + 1}</span>
                  <span className="stairs-static-label" data-magnet-part>{link.label}</span>
                  <span className="stairs-marquee" aria-hidden="true"><span className="stairs-marquee-magnet" data-magnet-part>{Array.from({ length: 4 }, (_, repeat) => <span className="stairs-marquee-item" key={repeat}>{link.label}<Image src="/images/alan-logo.png" width={48} height={48} alt="" /></span>)}</span></span>
                  <span className="stairs-arrow" aria-hidden="true" data-magnet-part><ArrowIcon /></span>
                </Link>
              ))}
              <div className="stairs-link stairs-resume" aria-disabled="true"><span className="stairs-index" aria-hidden="true">04</span><span>Resume</span><span className="stairs-pending">Coming soon</span></div>
            </nav>
            <nav className="stairs-profiles" aria-label="Professional profiles in menu">
              {professionalLinks.map((link) => <a key={link.label} href={link.href} onClick={onMenuLinkClick} data-magnet="text"><span data-magnet-part>{link.label}</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>)}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
