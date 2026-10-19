import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";

const resolve = createRequire(`${process.cwd()}/package.json`).resolve;
type AxeResult = { violations: { id: string; impact: string; nodes: { target: string[] }[] }[] };

const key = "portfolio-theme-v1";
const routes = ["/", "/about", "/contact", "/work/aurelia", "/work/paylecta", "/work/pawfriend", "/work/munchpal", "/missing-page"];
const headerToggle = (page: import("@playwright/test").Page) => page.locator(".site-header").getByRole("switch", { name: "Dark theme" });

for (const theme of ["light", "dark"]) {
  test(`all routes have no automated accessibility violations in ${theme} theme`, async ({ page }) => {
    test.setTimeout(90000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(({ storageKey, preference }) => localStorage.setItem(storageKey, preference), { storageKey: key, preference: theme });
    for (const route of routes) {
      await page.goto(route);
      await expect(headerToggle(page)).toBeEnabled();
      await page.addScriptTag({ path: resolve("axe-core/axe.min.js") });
      const violations = await page.evaluate(async () => {
        const axe = (window as typeof window & { axe: { run: () => Promise<AxeResult> } }).axe;
        return (await axe.run()).violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(node => node.target) }));
      });
      expect(violations, `${theme} ${route}`).toEqual([]);
    }
  });
}

test("every route starts light even on a device that prefers dark", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(page.locator("html")).toHaveCSS("color-scheme", "light");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(246, 245, 241)");
    await expect(headerToggle(page)).toHaveAttribute("aria-checked", "false");
  }
});

test("a saved dark preference applies before hydration on every route", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL });
  await context.addInitScript(storageKey => localStorage.setItem(storageKey, "dark"), key);
  // Prevent hydration to check the early theme bootstrap independently.
  await context.route("**/_next/static/**/*.js*", route => route.abort());
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(23, 25, 23)");
  }
  await context.close();
});

test("keyboard switching survives navigation, reload and return to light", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await headerToggle(page).focus();
  await page.keyboard.press("Space");
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "true");
  await expect(headerToggle(page)).toBeFocused();
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "true");
  await page.reload();
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "true");
  await headerToggle(page).click();
  await page.reload();
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "false");
  expect(errors).toEqual([]);
});

test("blocked storage still permits switching and client navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Storage denied", "SecurityError"); } });
  });
  await page.goto("/about");
  await headerToggle(page).click();
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "true");
  await headerToggle(page).click();
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "false");
  expect(errors).toEqual([]);
});

test("preference changes sync between tabs and clearing storage restores light", async ({ context, page }) => {
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/contact");
  await headerToggle(page).click();
  await expect(headerToggle(other)).toHaveAttribute("aria-checked", "true");
  await other.evaluate(() => localStorage.clear());
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "false");
  await other.close();
});

test("an invalid stored value safely falls back to light", async ({ page }) => {
  await page.addInitScript(storageKey => localStorage.setItem(storageKey, "unexpected"), key);
  await page.goto("/about");
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "false");
});

test("compact and menu switches remain reachable on a narrow screen with enlarged text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.documentElement.style.fontSize = "200%");
  await page.evaluate(() => scrollTo(0, 900));
  const compact = page.locator(".compact-menu-rail").getByRole("switch", { name: "Dark theme" });
  await expect(compact).toBeVisible();
  await compact.click();
  await expect(compact).toHaveAttribute("aria-checked", "true");
  const box = await compact.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await page.getByRole("button", { name: "Open menu" }).click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await dialog.getByRole("switch", { name: "Dark theme" }).click();
  await expect(dialog.getByRole("switch", { name: "Dark theme" })).toHaveAttribute("aria-checked", "false");
  expect(await page.locator(".compact-menu-rail").evaluate(node => (node as HTMLElement).inert)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
});

test("dark fields, validation feedback and print have appropriate surfaces", async ({ page }) => {
  await page.goto("/contact");
  await headerToggle(page).click();
  await expect(page.getByLabel("Your name")).toHaveCSS("background-color", "rgb(34, 37, 31)");
  await page.getByRole("button", { name: "Open email draft" }).click();
  await expect(page.getByText("Enter your name.", { exact: true })).toHaveCSS("color", "rgb(255, 171, 152)");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(headerToggle(page)).toBeHidden();
});

test("without JavaScript, light content and native navigation remain usable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("/about");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(246, 245, 241)");
  await expect(headerToggle(page)).toBeHidden();
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
  await expect(page.getByLabel("Your message")).toBeVisible();
  await context.close();
});

test("switching themes preserves geometry and adds no layout shift", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  await expect(headerToggle(page)).toBeEnabled();
  const before = await page.locator("main").boundingBox();
  await page.evaluate(() => {
    (window as Window & { themeShifts?: number }).themeShifts = 0;
    new PerformanceObserver(list => {
      const target = window as Window & { themeShifts?: number };
      for (const entry of list.getEntries()) target.themeShifts = (target.themeShifts ?? 0) + (entry as PerformanceEntry & { value: number }).value;
    }).observe({ type: "layout-shift" });
  });
  await headerToggle(page).click();
  await expect(headerToggle(page)).toHaveAttribute("aria-checked", "true");
  expect(await page.locator("main").boundingBox()).toEqual(before);
  expect(await page.evaluate(() => (window as Window & { themeShifts?: number }).themeShifts)).toBe(0);
});
