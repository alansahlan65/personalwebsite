"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce), (forced-colors: active)";
let media: MediaQueryList | undefined;
const subscribers = new Set<() => void>();
function getMedia() { return media ??= window.matchMedia(query); }
function notify() { subscribers.forEach(onChange => onChange()); }
function subscribe(onChange: () => void) {
  const preference = getMedia();
  if (subscribers.size === 0) preference.addEventListener("change", notify);
  subscribers.add(onChange);
  return () => {
    subscribers.delete(onChange);
    if (subscribers.size === 0) preference.removeEventListener("change", notify);
  };
}
function getSnapshot() { return getMedia().matches; }
function getServerSnapshot() { return true; }

// The installed Motion hook captures the preference only at mount.
// Subscribe here so an open About interaction also reacts to device changes.
export function useMotionPreference() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
