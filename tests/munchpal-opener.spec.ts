import { expect, test } from "@playwright/test";

test("MunchPal tour plays, pauses, replays and stays paused after leaving the viewport", async ({ page }) => {
  await page.goto("/work/munchpal");
  const video = page.getByLabel("20-second MunchPal product tour");
  await video.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0)).toBe(true);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration)).toBe(20);
  await page.getByRole("button", { name: "Pause MunchPal product tour" }).click();
  const pausedAt = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.locator("#munchpal-evaluation").scrollIntoViewIfNeeded();
  await video.scrollIntoViewIfNeeded();
  expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeCloseTo(pausedAt, 1);
  await page.getByRole("button", { name: "Replay MunchPal product tour" }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime < 2)).toBe(true);
  await page.locator("#munchpal-evaluation").scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test("reduced motion shows a still until explicit play and reacts to a preference change", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/munchpal");
  const video = page.getByLabel("20-second MunchPal product tour");
  await video.scrollIntoViewIfNeeded();
  await expect(page.getByRole("button", { name: "Play MunchPal product tour", exact: true })).toBeVisible();
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused && v.currentTime === 0 && !v.autoplay)).toBe(true);
  await page.getByRole("button", { name: "Play MunchPal product tour", exact: true }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused && v.currentTime === 0)).toBe(true);
});

test("without JavaScript the tour has native controls and the case story remains usable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work/munchpal");
  const video = page.getByLabel("20-second MunchPal product tour");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("poster", "/demos/munchpal/poster.webp");
  await expect(page.getByRole("button", { name: /MunchPal product tour/ })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "What testing showed" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

test("MunchPal gallery entry keeps the tour and return navigation usable", async ({ page }) => {
  await page.goto("/");
  const project = page.locator('[data-project="munchpal"]').getByRole("link");
  await project.scrollIntoViewIfNeeded();
  await project.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/munchpal$/);
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal" })).toBeFocused();
  await expect(page.getByLabel("20-second MunchPal product tour")).toBeVisible();
  await page.getByRole("link", { name: "Back to selected work" }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeFocused();
});
