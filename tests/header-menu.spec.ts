import { expect, test } from "@playwright/test";

test("header changes at the scroll thresholds without shifting the page", async ({ page }) => {
  await page.goto("/");
  const full = page.getByRole("navigation", { name: "Primary" });
  const compact = page.locator(".compact-menu-trigger");
  await expect(full.getByRole("link", { name: "Work" })).toBeVisible();
  await expect(compact).toBeHidden();
  const heroTop = await page.locator(".hero").evaluate((node) => (node as HTMLElement).offsetTop);

  await page.evaluate(() => window.scrollTo(0, 110));
  await expect(compact).toBeVisible();
  await expect(full.getByRole("link", { name: "Work" })).toBeHidden();
  expect(await page.locator(".hero").evaluate((node) => (node as HTMLElement).offsetTop)).toBe(heroTop);

  await page.evaluate(() => window.scrollTo(0, 70));
  await expect(compact).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 40));
  await expect(full.getByRole("link", { name: "Work" })).toBeVisible();
  await expect(compact).toBeHidden();
});

test("header keeps its focused link during scroll", async ({ page }) => {
  await page.goto("/");
  const work = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" });
  await work.focus();
  await page.evaluate(() => window.scrollTo(0, 150));
  await expect(work).toBeFocused();
  await expect(work).toBeVisible();
  await work.blur();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});

test("Escape during opening restores focus and scroll, with no overlay left behind", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 360));
  const trigger = page.locator(".compact-menu-trigger");
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "About", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(360);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});

test("menu navigation works during opening and focuses the destination", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 240));
  await page.locator(".compact-menu-trigger").click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "About me" })).toBeFocused();
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});


test("the dialog contains focus and keeps the page inert during resize", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 250));
  await page.locator(".compact-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  const close = dialog.getByRole("button", { name: "Close menu" });
  await expect(close).toBeFocused();
  expect(await page.getByRole("main", { includeHidden: true }).evaluate((element) => (element as HTMLElement).inert)).toBe(true);
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: /Behance/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(close).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await close.click();
  await expect(dialog).toHaveCount(0);
  expect(await page.getByRole("main").evaluate((element) => (element as HTMLElement).inert)).toBe(false);
});

test("rapid close and reopen follows the latest intent", async ({ page }) => {
  await page.goto("/");
  await page.locator(".full-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await dialog.getByRole("button", { name: "Reopen menu" }).click();
  await expect(dialog.getByRole("button", { name: "Close menu" })).toBeVisible();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toHaveCount(0);
});

test("same-page menu navigation focuses the chosen section", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 230));
  await page.locator(".compact-menu-trigger").click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeFocused();
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});

test("reduced motion changes during opening leave a complete, immediate menu", async ({ page }) => {
  await page.goto("/");
  await page.locator(".full-menu-trigger").click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".full-menu-trigger")).toBeFocused();
});

test("hover strips stop and static labels return on exit", async ({ page }) => {
  await page.goto("/");
  await page.locator(".full-menu-trigger").click();
  const work = page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Work", exact: true });
  await work.hover();
  await expect(work.locator(".stairs-marquee")).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(work.locator(".stairs-marquee")).toBeHidden();
  await expect(work.locator(".stairs-static-label")).toBeVisible();
});



test("restored scroll and direct About loads choose the right header mode", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(page.locator(".compact-menu-trigger")).toBeVisible();
  await page.reload();
  await expect(page.locator(".compact-menu-trigger")).toBeVisible();
  await page.locator(".compact-menu-trigger").click();
  await expect(page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true })).toHaveAttribute("aria-current", "page");
});

test("modified menu clicks preserve a new tab and leave the current menu usable", async ({ page, context }) => {
  await page.goto("/");
  await page.locator(".full-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  const opened = context.waitForEvent("page");
  await dialog.getByRole("link", { name: "About", exact: true }).click({ modifiers: ["Control"] });
  const newPage = await opened;
  await expect(newPage).toHaveURL(/\/about$/);
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toHaveCount(0);
  await newPage.close();
});

test("menu navigation and Back leave no lock or overlay", async ({ page }) => {
  await page.goto("/");
  await page.locator(".full-menu-trigger").click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Work" })).toBeVisible();
});

test("the menu fits at 320 pixels and has one focusable link per destination", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.locator(".full-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog.getByRole("link", { name: "Work", exact: true })).toHaveCount(1);
  await expect(dialog.getByRole("link", { name: "About", exact: true })).toHaveCount(1);
  await expect(dialog.getByRole("link", { name: "Contact", exact: true })).toHaveCount(1);
  await expect(dialog.getByRole("link", { name: "Resume" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

