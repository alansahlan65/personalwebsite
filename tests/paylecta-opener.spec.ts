import { expect, test } from "@playwright/test";

test("Paylecta tour plays, pauses, replays and preserves a manual pause across scrolling", async ({ page }) => {
  await page.goto("/work/paylecta");
  const video = page.getByLabel("26-second Paylecta product tour");
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration)).toBe(26);
  await page.getByRole("button", { name: "Pause Paylecta product tour" }).click();
  const pausedAt = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await page.locator("#paylecta-delivery-title").scrollIntoViewIfNeeded();
  await video.scrollIntoViewIfNeeded();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeCloseTo(pausedAt, 1);
  await page.getByRole("button", { name: "Replay Paylecta product tour" }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime < 2)).toBe(true);
  await page.locator("#paylecta-delivery-title").scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test("Paylecta reduced motion starts with a poster and pauses when the preference changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/paylecta");
  const video = page.getByLabel("26-second Paylecta product tour");
  await video.scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "Play Paylecta product tour", exact: true })).toBeVisible();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused && v.currentTime === 0 && !v.autoplay)).toBe(true);
  await page.getByRole("button", { name: "Play Paylecta product tour", exact: true }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused && v.currentTime === 0)).toBe(true);
});

test("Paylecta native controls and reading flow work without JavaScript on mobile", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work/paylecta");
  const video = page.getByLabel("26-second Paylecta product tour");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("poster", "/demos/paylecta/poster.webp");
  await expect(page.getByRole("button", { name: /Paylecta product tour/ })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "The design delivered" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

test("Paylecta gallery entry focuses the title, opens the tour and returns to selected work", async ({ page }) => {
  await page.goto("/");
  const project = page.locator('[data-project="paylecta"]').getByRole("link");
  await project.scrollIntoViewIfNeeded();
  await project.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/paylecta$/);
  await expect(page.getByRole("heading", { level: 1, name: "Paylecta" })).toBeFocused();
  await expect(page.getByLabel("26-second Paylecta product tour")).toBeVisible();
  await page.getByRole("link", { name: "Back to selected work" }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeFocused();
});
