import { expect, test } from "@playwright/test";

test("magnetic visuals move while the link hit area stays fixed and clickable", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const about = page.getByRole("link", { name: "More about me" });
  await expect(about).toHaveAttribute("data-magnet", "text");
  const visual = about.locator("[data-magnet-part]").first();
  const targetBefore = await about.evaluate((element) => { const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y + window.scrollY, width: rect.width, height: rect.height }; });
  await about.hover({ position: { x: targetBefore!.width - 8, y: targetBefore!.height / 2 } });
  await expect.poll(() => visual.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  const targetAfter = await about.evaluate((element) => { const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y + window.scrollY, width: rect.width, height: rect.height }; });
  expect(Math.abs(targetAfter!.x - targetBefore!.x)).toBeLessThan(1);
  expect(Math.abs(targetAfter!.y - targetBefore!.y)).toBeLessThan(1);
  await about.click({ position: { x: 8, y: targetBefore!.height / 2 } });
  await expect(page).toHaveURL(/\/about$/);
});

test("cursor inverts images, shows an arrow only on actionable imagery, and resets", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const cursor = page.locator(".site-cursor");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  await page.locator(".portrait-frame img").hover();
  await expect(cursor).toHaveAttribute("data-mode", "image");
  await expect(cursor).toHaveCSS("mix-blend-mode", "difference");
  await expect(page.locator(".site-cursor-arrow")).toBeHidden();
  const project = page.locator(".project-row").first();
  await project.getByRole("link", { name: /Aurelia/ }).hover();
  await expect.poll(() => project.locator(".project-preview").evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await project.locator(".project-preview img").hover();
  await expect(cursor).toHaveAttribute("data-mode", "action-image");
  await expect(page.locator(".site-cursor-arrow")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(cursor).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-cursor-ready", "true");
});
test("every current action is inventoried once, including menu and case-study controls", async ({ page }) => {
  await page.goto("/");
  const unmarked = () => page.evaluate(() => Array.from(document.querySelectorAll("a[href], button"))
    .filter((element) => !element.hasAttribute("data-magnet"))
    .map((element) => element.outerHTML.slice(0, 120)));
  expect(await unmarked()).toEqual([]);
  await expect(page.locator("[data-magnet] [data-magnet]")).toHaveCount(0);
  await expect(page.getByText("Resume", { exact: true }).first()).toHaveAttribute("aria-disabled", "true");
  await page.locator(".full-menu-trigger").click();
  expect(await unmarked()).toEqual([]);
  await expect(page.getByRole("dialog", { name: "Navigation menu" }).locator("[data-magnet]")).toHaveCount(7);
  const menuWork = page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Work", exact: true });
  await menuWork.hover({ position: { x: 8, y: 8 } });
  await expect.poll(() => menuWork.locator(".stairs-marquee-magnet").evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await expect(menuWork.locator(".stairs-marquee")).toHaveCSS("animation-name", "stairs-marquee-travel");
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("button", { name: "Close menu" }).click();
  await page.goto("/work/aurelia");
  expect(await unmarked()).toEqual([]);
  await expect(page.locator(".case-study [data-magnet]")).toHaveCount(3);
});

test("rapid target changes return the prior visual and keyboard focus stays still", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const work = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" });
  const about = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" });
  await work.hover({ position: { x: 5, y: 5 } });
  await expect.poll(() => work.locator("[data-magnet-part]").evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await about.hover({ position: { x: 5, y: 5 } });
  await expect.poll(() => work.locator("[data-magnet-part]").evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  await page.mouse.move(0, 0);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const brand = page.locator(".site-header .brand");
  await expect(brand).toBeFocused();
  expect(await brand.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await brand.hover({ position: { x: 8, y: 8 } });
  await expect(brand.locator("[data-magnet-part]").first()).toHaveCSS("transform", "none");
});

test("cursor restores native behavior for selection and window exit, then resumes", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const cursor = page.locator(".site-cursor");
  await page.locator(".portrait-frame img").hover();
  await expect(cursor).toHaveAttribute("data-mode", "image");
  await page.evaluate(() => {
    const text = document.querySelector(".role-lines p")!.firstChild!;
    const range = document.createRange();
    range.selectNodeContents(text);
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    selection.addRange(range);
  });
  await expect(cursor).toBeHidden();
  await expect(page.locator("html")).not.toHaveAttribute("data-cursor-ready", "true");
  await page.evaluate(() => window.getSelection()?.removeAllRanges());
  await page.locator(".portrait-frame img").hover();
  await expect(cursor).toHaveAttribute("data-mode", "image");
  await page.mouse.move(-10, -10);
  await expect(cursor).toBeHidden();
  await page.mouse.move(100, 100);
  await expect(cursor).toHaveAttribute("data-mode", "dot");
});

test("menu and route changes clear the large cursor without blocking navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const cursor = page.locator(".site-cursor");
  const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await project.hover();
  await expect.poll(() => page.locator(".project-preview").first().evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.locator(".project-preview img").hover();
  await expect(cursor).toHaveAttribute("data-mode", "action-image");
  await page.locator(".compact-menu-trigger").click();
  await expect(cursor).toBeHidden();
  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  await menu.getByRole("link", { name: "About", exact: true }).hover();
  await expect(cursor).toHaveAttribute("data-mode", "dot");
  await menu.getByRole("button", { name: "Close menu" }).click();
  await expect(menu).toHaveCount(0);
  await project.click();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(cursor).toBeHidden();
});

test.describe("touch pointer fallback", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("uses the native cursor and opens the project in one tap", async ({ page }) => {
    await page.goto("/");
    const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
    await project.tap();
    await expect(page).toHaveURL(/\/work\/aurelia$/);
    await expect(page.locator(".site-cursor")).toBeHidden();
    await expect(page.locator("html")).not.toHaveAttribute("data-cursor-ready", "true");
  });
});

test("forced colors disables displacement and the custom cursor until preference changes", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const about = page.getByRole("link", { name: "More about me" });
  await about.hover();
  await expect(about.locator("[data-magnet-part]").first()).toHaveCSS("transform", "none");
  await expect(page.locator(".site-cursor")).toBeHidden();
  await page.emulateMedia({ forcedColors: "none" });
  await about.hover({ position: { x: 8, y: 8 } });
  await expect.poll(() => about.locator("[data-magnet-part]").first().evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
});

test("missing color-compositing support leaves native pointer and actions intact", async ({ page }) => {
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = (property: string, value?: string) => property === "mix-blend-mode" ? false : supports(property, value ?? "");
  });
  await page.goto("/");
  await page.getByRole("link", { name: "More about me" }).hover();
  await expect(page.locator("html")).not.toHaveAttribute("data-cursor-ready", "true");
  await page.getByRole("link", { name: "More about me" }).click();
  await expect(page).toHaveURL(/\/about$/);
});


test("keyboard focus clears an already moving magnetic control", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const brand = page.locator(".site-header .brand");
  const visual = brand.locator("[data-magnet-part]").first();
  await brand.hover({ position: { x: 8, y: 8 } });
  await expect.poll(() => visual.evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(brand).toBeFocused();
  await expect(visual).toHaveCSS("transform", "none");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
});

test("the project opens at the actual pointer position while its preview and title move", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const project = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await project.scrollIntoViewIfNeeded();
  const box = await project.boundingBox();
  const x = box!.x + box!.width - 8;
  const y = box!.y + box!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.up();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
});
