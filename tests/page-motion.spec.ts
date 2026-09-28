import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents = [];
    Element.prototype.animate = function (...args: Parameters<Element["animate"]>) {
      const animation = original.apply(this, args);
      if (animation.id.startsWith("page-motion-")) {
        (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents.push(animation.id);
      }
      return animation;
    };
  });
});

test("the homepage opens as one composed moment and reveals the work list on entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero h1")).toHaveCSS("animation-name", "opening-copy");
  await expect(page.locator(".hero .portrait-frame")).toHaveCSS("animation-name", "opening-portrait");
  await expect(page.locator("#work .section-intro")).toHaveAttribute("data-page-motion", "soft");

  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents.filter((id) => id === "page-motion-soft").length,
  )).toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: /Aurelia, Hospitality case study/ })).toBeVisible();
});

test("jumping to selected work keeps its link clear of the compact menu", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").evaluate((element) => element.scrollIntoView());
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveClass(/is-visible/);
  const positions = await page.evaluate(() => ({
    menuBottom: document.querySelector(".compact-menu-trigger")!.getBoundingClientRect().bottom,
    workLinkTop: document.querySelector(".work-all")!.getBoundingClientRect().top,
  }));
  expect(positions.workLinkTop).toBeGreaterThan(positions.menuBottom);
});

test("About and case-study reading sections enter without delaying their content", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator(".about-page h1")).toHaveCSS("animation-name", "opening-copy");
  await page.locator(".about-details section").nth(1).scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents.length,
  )).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Designing and building" })).toBeVisible();

  await page.goto("/work/paylecta");
  await expect(page.locator(".case-lead")).toHaveCSS("animation-name", "opening-copy");
  await page.locator(".case-decision").first().scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents.length,
  )).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Give the balance a clear place" })).toBeVisible();
});

test("reduced motion keeps the complete page still and readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero h1")).toHaveCSS("animation-name", "none");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: /Munchpal, Food sharing case study/ })).toBeVisible();
  expect(await page.evaluate(() => (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents)).toEqual([]);
});

test("turning on reduced motion cancels an in-progress section entrance", async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<Element["animate"]>) {
      const animation = original.apply(this, args);
      if (animation.id.startsWith("page-motion-")) animation.pause();
      return animation;
    };
  });
  await page.goto("/");
  await page.locator("#work").scrollIntoViewIfNeeded();
  const rows = page.locator(".project-row");
  await expect.poll(() => rows.first().evaluate((element) =>
    element.getAnimations().filter((animation) => animation.id === "page-motion-soft").length,
  )).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => rows.first().evaluate((element) =>
    element.getAnimations().filter((animation) => animation.id === "page-motion-soft").length,
  )).toBe(0);
  await expect(rows.first().getByRole("link")).toBeVisible();
});
