// Reading position is an enhancement. Private browsing or a storage policy
// must never prevent a link from navigating or the destination from focusing.
export function readSessionValue(key: string): string | null {
  try { return sessionStorage.getItem(key); } catch { return null; }
}

export function writeSessionValue(key: string, value: string) {
  try { sessionStorage.setItem(key, value); } catch { /* Native navigation remains available. */ }
}

export function removeSessionValue(key: string) {
  try { sessionStorage.removeItem(key); } catch { /* Storage is optional. */ }
}
