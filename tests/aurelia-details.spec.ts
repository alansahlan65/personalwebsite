import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1440]) {
  test(`complete Aurelia SVGs load proportionally without overflow at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/work/aurelia");
    for (const image of await page.locator("main img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute("src", /^\/images\/figma\/aurelia\/.+\.svg$/);
      await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
      if (await image.getAttribute("data-complete") === null) {
        const geometry = await image.evaluate((node: HTMLImageElement) => ({
          displayed: node.getBoundingClientRect().width / node.getBoundingClientRect().height,
          source: node.naturalWidth / node.naturalHeight,
        }));
        expect(geometry.displayed).toBeCloseTo(geometry.source, 2);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.getByRole("switch", { name: "Dark theme" }).first().check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    expect(errors).toEqual([]);
  });
}

test("Aurelia flow links navigate in order and original SVGs open by keyboard", async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/aurelia");
  const links = page.getByRole("navigation", { name: "Aurelia website flow" }).getByRole("link");
  for (const link of await links.all()) {
    const fragment = await link.getAttribute("href");
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(fragment!)).toBeFocused();
    await expect(page.locator(fragment!)).toBeInViewport();
  }
  const sourceLink = page.getByRole("link", { name: "Open Browse and filter the collection at full size" });
  await sourceLink.focus();
  const [source] = await Promise.all([context.waitForEvent("page"), page.keyboard.press("Enter")]);
  await source.waitForLoadState();
  await expect(source).toHaveURL(/\/images\/figma\/aurelia\/collection\.svg$/);
  await expect(source.locator("svg")).toHaveAttribute("viewBox", "0 0 1912 1575");
  await source.close();
  await page.getByRole("link", { name: "Back to selected work" }).last().click();
  await expect(page.locator("#work")).toBeFocused();
});

test("Aurelia keeps the complete journey and source access without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work/aurelia#aurelia-request");
  await expect(page.locator("#aurelia-request")).toBeInViewport();
  await expect(page.getByRole("list", { name: "Stay request steps and review" }).getByRole("listitem")).toHaveCount(4);
  await page.getByRole("link", { name: "Open 1. Dates and guests at full size" }).focus();
  await expect(page.getByRole("link", { name: "Open 1. Dates and guests at full size" })).toBeInViewport();
  await expect(page.getByText(/It does not send a request, take payment or hold dates/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await context.close();
});

test("Aurelia keeps truthful scope and user-controlled workflow playback", async ({ page }) => {
  await page.goto("/work/aurelia");
  await expect(page.getByText(/ten fictional homes/)).toBeVisible();
  await expect(page.getByText(/Availability and final pricing require confirmation/)).toBeVisible();
  await expect(page.getByText(/English and Indonesian/)).toBeVisible();
  await page.getByText("Build notes and workflow recording", { exact: true }).click();
  await expect(page.getByText(/Ask Aurelia uses local rules and prepared responses/)).toBeVisible();
  const video = page.getByLabel("Recorded Aurelia filter, stay details, and request workflow");
  await expect(video).toHaveAttribute("poster", /\.svg$/);
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("autoplay", "");
  await video.scrollIntoViewIfNeeded();
  await video.evaluate((node: HTMLVideoElement) => node.play());
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(0);
  await video.evaluate((node: HTMLVideoElement) => node.pause());
});
