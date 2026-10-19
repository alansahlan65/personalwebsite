import { expect, test } from "@playwright/test";

test("gallery focus wins over cross-row hover and Paylecta has a single keyboard stop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  const rows = page.locator(".project-row");
  const paylecta = rows.nth(1);
  await page.keyboard.press("Tab");
  await paylecta.getByRole("link", { includeHidden: true }).focus();
  await rows.nth(0).getByRole("heading").hover();
  await expect(paylecta).toHaveAttribute("data-expanded", "true");
  await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(paylecta.getByRole("link", { includeHidden: true })).not.toBeFocused();
  await expect(paylecta).toHaveAttribute("data-expanded", "false");
  await page.keyboard.press("Shift+Tab");
  await expect(paylecta.getByRole("link", { includeHidden: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1, name: "Paylecta" })).toBeFocused();
  await page.goBack();
  await expect(paylecta.getByRole("link", { includeHidden: true })).toBeFocused();
  await page.locator("#work").focus();
  await expect(page.locator("#work")).toBeFocused();
  await page.mouse.move(0, 0);
  for (const index of [0, 1, 0, 1, 0, 1]) {
    await rows.nth(index).getByRole("heading").hover();
    await expect(rows.nth(index)).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
  }
  await expect(paylecta.getByRole("heading", { name: "Paylecta", exact: true })).toBeVisible();
});

test("Paylecta shares its image on entry and new-tab entry preserves the original page", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const project = page.getByRole("link", { name: "Paylecta, Finance case study", exact: true });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  await project.locator(".project-preview img").last().hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "action-image");
  await project.locator(".project-preview img").last().click();
  await expect(page).toHaveURL(/\/work\/paylecta$/);
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(animation => {
    const effect = animation.effect as KeyframeEffect | null;
    return effect?.pseudoElement?.includes("view-transition-group(paylecta-image)") && animation.playState === "running";
  })), { intervals: [10, 10, 20] }).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "Paylecta" })).toBeFocused();
  await page.goto("/#work");
  const [newPage] = await Promise.all([context.waitForEvent("page"), project.click({ modifiers: ["Control"] })]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/\/work\/paylecta$/);
  await expect(newPage.getByRole("heading", { level: 1, name: "Paylecta" })).toBeVisible();
  await expect(page).toHaveURL(/\/#work$/);
  await newPage.getByRole("link", { name: "Back to selected work" }).first().click();
  await expect(newPage.locator("#work")).toBeFocused();
  await expect(newPage.getByRole("heading", { name: "Selected work" })).toBeInViewport();
  await newPage.close();
});

test("Paylecta opens from one gallery link and returns to the saved selection", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const row = page.locator('.project-row[data-project="paylecta"]');
  const project = row.getByRole("link", { name: "Paylecta, Finance case study", exact: true });
  await expect(row.getByRole("link", { includeHidden: true })).toHaveCount(1);
  await expect(project).toHaveAttribute("href", "/work/paylecta");
  await expect(project).not.toHaveAttribute("target", "_blank");
  await project.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const compactWidth = (await row.locator(".project-preview").boundingBox())!.width;
  await row.getByRole("heading", { name: "Paylecta", exact: true }).hover();
  await expect(row).toHaveAttribute("data-expanded", "true");
  await expect.poll(() => row.locator(".project-preview").evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(compactWidth * 1.7);
  await expect.poll(() => row.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await page.mouse.move(0, 0);
  await expect(row).toHaveAttribute("data-expanded", "false");
  await expect.poll(async () => Math.abs((await row.locator(".project-preview").boundingBox())!.width - compactWidth)).toBeLessThan(2);
  const before = await page.evaluate(() => window.scrollY);
  await project.click({ position: { x: 8, y: 8 } });
  await expect(page).toHaveURL(/\/work\/paylecta$/);
  await expect(page.getByRole("heading", { level: 1, name: "Paylecta" })).toBeFocused();
  await page.goBack();
  await expect(project).toBeFocused();
  await expect(project).toBeInViewport();
  await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(80);
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1, name: "Paylecta" })).toBeFocused();
  await page.getByRole("link", { name: "Back to selected work" }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeFocused();
  await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(80);
});
