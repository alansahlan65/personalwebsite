export const THEME_STORAGE_KEY = "portfolio-theme-v1";
export const THEME_CHANGE_EVENT = "portfolio:theme-change";

// Run before the body paints. Storage is optional, and light is always the default.
export const THEME_INIT_SCRIPT = `(() => {
  let theme = "light";
  try { if (localStorage.getItem("${THEME_STORAGE_KEY}") === "dark") theme = "dark"; } catch {}
  document.documentElement.dataset.theme = theme;
})();`;
