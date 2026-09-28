import { expect, test } from "@playwright/test";

test("Aurelia connects its preview to the hero and remains usable during entry", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  await project.locator(".project-banner-expanded").hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "action-image");
  await project.locator(".project-banner-expanded").click();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect.poll(() => page.evaluate(() => document.getAnimations().some((animation) => {
    const effect = animation.effect as KeyframeEffect | null;
    return effect?.pseudoElement?.includes("view-transition-group(aurelia-image)") && animation.playState === "running";
  })), { intervals: [10, 10, 20] }).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
  await page.getByRole("link", { name: /Back to selected work/ }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeFocused();
  await expect(project).toBeInViewport();
});


for (const failure of ["unavailable", "throws", "skipped"] as const) {
  test(`Aurelia navigation and return recover when transitions are ${failure}`, async ({ page }) => {
    await page.addInitScript((failure) => {
      const nativeStart = document.startViewTransition?.bind(document);
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: failure === "unavailable" ? undefined : (...args: Parameters<Document["startViewTransition"]>) => {
          if (failure === "throws") throw new Error("Transition unavailable");
          const transition = nativeStart!(...args);
          transition.skipTransition();
          return transition;
        },
      });
    }, failure);
    await page.goto("/");
    const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
    await project.click();
    await expect(page).toHaveURL(/\/work\/aurelia$/);
    await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
    await expect(page.locator(".case-hero img")).toBeVisible();
    await page.getByRole("link", { name: /Back to selected work/ }).first().click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeFocused();
  });
}


test("an immediate click during preview growth reaches the hero and preserves history", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await project.scrollIntoViewIfNeeded();
  const startingY = await page.evaluate(() => window.scrollY);
  const rect = await project.boundingBox();
  await page.mouse.move(rect!.x + 8, rect!.y + 8);
  await page.mouse.click(rect!.x + 8, rect!.y + 8);
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
  await expect(page.locator(".case-hero img")).toBeVisible();
  await expect(page.locator(".site-cursor")).toBeHidden();
  await page.goBack();
  await expect(project).toBeFocused();
  await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - startingY)).toBeLessThan(80);
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
});

test("reducing motion during shared entry keeps the destination and return usable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  await project.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
  await expect(page.locator(".case-title")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".site-cursor")).toBeHidden();
  await page.getByRole("link", { name: /Back to selected work/ }).first().click();
  await expect(page.locator("#work")).toBeFocused();
});

test("keyboard entry without an expanded source still opens meaningful project content", async ({ page }) => {
  await page.goto("/");
  const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await project.scrollIntoViewIfNeeded();
  await project.locator(".project-preview").evaluate((element) => { element.style.display = "none"; });
  await project.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
  await expect(page.locator(".case-hero img")).toBeVisible();
  await page.getByRole("link", { name: /Back to selected work/ }).first().click();
  await expect(page.locator("#work")).toBeFocused();
});
