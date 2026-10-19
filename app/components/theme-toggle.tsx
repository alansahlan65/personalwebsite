"use client";

import { useSyncExternalStore } from "react";
import { ThemeIcon } from "./ui-icons";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY } from "../lib/theme";
import { ControlVisual } from "./control-visual";

function readTheme() {
  return document.documentElement.dataset.theme === "dark";
}

function setTheme(dark: boolean) {
  if (readTheme() === dark) return;
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

let initialized = false;

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    try {
      if (event.storageArea === window.localStorage) setTheme(event.newValue === "dark");
    } catch { /* A browser can revoke storage access while the page is open. */ }
  }
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  // Another tab may change the preference between the early script and hydration.
  // Reconcile once, then preserve in-memory changes if later writes are denied.
  if (!initialized) {
    initialized = true;
    try { setTheme(localStorage.getItem(THEME_STORAGE_KEY) === "dark"); } catch { /* Storage is optional. */ }
  }
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const serverTheme = () => false;
const hydrated = () => true;
const subscribeHydration = () => () => {};

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const dark = useSyncExternalStore(subscribe, readTheme, serverTheme);
  const ready = useSyncExternalStore(subscribeHydration, hydrated, serverTheme);

  function toggle() {
    const next = !readTheme();
    setTheme(next);
    try { localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light"); } catch { /* Keep the preference in this document when storage is denied. */ }
  }

  return <button className={`theme-toggle${compact ? " theme-toggle--compact" : ""}`} type="button" role="switch"
    aria-label="Dark theme" aria-checked={dark} disabled={!ready} onClick={toggle}
    data-pointer-feedback="local" title={dark ? "Switch to light theme" : "Switch to dark theme"}>
    <ControlVisual className="theme-switch-track"><span className="theme-icon-sun" aria-hidden="true"><ThemeIcon kind="sun" /></span><span className="theme-icon-moon" aria-hidden="true"><ThemeIcon kind="moon" /></span></ControlVisual>
  </button>;
}
