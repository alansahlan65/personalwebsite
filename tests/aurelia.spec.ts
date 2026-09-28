import { expect, test } from "@playwright/test";

test("Aurelia opens a compact banner into a wide banner without delaying navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const row = page.locator(".project-row").first();
  const link = row.getByRole("link", { name: /Aurelia/ });
  const preview = row.locator(".project-preview");
  const category = row.locator(".project-category");
  await expect(link).toHaveAttribute("href", "/work/aurelia");
  await expect(row.getByRole("link")).toHaveCount(1);
  await expect(row.getByRole("heading", { name: "Aurelia" })).toBeVisible();
  await expect(row.getByText("Hospitality")).toBeVisible();
  await expect.poll(() => row.locator(".project-banner-compact").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const rowBefore = await row.evaluate((element) => { const rect = element.getBoundingClientRect(); return { y: rect.y + window.scrollY, height: rect.height }; });
  const categoryBefore = await category.boundingBox();
  const compactWidth = await preview.evaluate((element) => element.getBoundingClientRect().width);
  expect(compactWidth).toBeGreaterThan(150);

  await link.hover({ position: { x: 8, y: 8 } });
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(compactWidth * 1.7);
  const rowAfter = await row.evaluate((element) => { const rect = element.getBoundingClientRect(); return { y: rect.y + window.scrollY, height: rect.height }; });
  const categoryAfter = await category.boundingBox();
  expect(Math.abs(rowAfter!.y - rowBefore!.y)).toBeLessThan(2);
  expect(rowAfter!.height - rowBefore!.height).toBeGreaterThan(150);
  expect(Math.abs(categoryAfter!.x - categoryBefore!.x)).toBeLessThan(2);
  await expect(row.locator(".project-banner-expanded")).toHaveCSS("opacity", "1");
  await expect(row.locator(".project-banner-compact")).toHaveCSS("opacity", "0");

  await page.mouse.move(0, 0);
  await expect.poll(async () => Math.abs((await preview.evaluate((element) => element.getBoundingClientRect().width)) - compactWidth)).toBeLessThan(2);
  await link.click();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
});



test("Aurelia preview retargets on pointer movement and keyboard focus takes precedence", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const row = page.locator(".project-row").first();
  const link = row.getByRole("link", { name: /Aurelia/ });
  const preview = row.locator(".project-preview");
  await link.scrollIntoViewIfNeeded();
  await link.hover({ position: { x: 8, y: 8 } });
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await row.getByRole("heading", { name: "Aurelia" }).hover();
  await row.getByText("Hospitality").hover();
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  const rightEdge = (await link.boundingBox())!.width - 8;
  await link.hover({ position: { x: rightEdge, y: 8 } });
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);

  await page.mouse.move(0, 0);
  await expect(row).toHaveAttribute("data-expanded", "false");
  await link.hover({ position: { x: 8, y: 8 } });
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width), { intervals: [10, 10, 20] }).toBeGreaterThan(20);
  await expect(row).toHaveAttribute("data-expanded", "true");
  await page.mouse.move(0, 0);
  await expect(row).toHaveAttribute("data-expanded", "false");
  await link.hover({ position: { x: 8, y: 8 } });
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.keyboard.press("Tab");
  await link.focus();
  await page.mouse.move(0, 0);
  await expect(row).toHaveAttribute("data-expanded", "true");
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.keyboard.press("Tab");
  await expect(row).toHaveAttribute("data-expanded", "false");
});

test("direct Aurelia visit has verified concept details and a working live destination", async ({ page }) => {
  await page.goto("/work/aurelia");
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeVisible();
  await expect(page.getByText("Independent product design and frontend build.", { exact: true })).toBeVisible();
  await expect(page.getByText("None.", { exact: true })).toBeVisible();
  await expect(page.getByText(/not a confirmed booking/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Design decisions" })).toBeVisible();
  await expect(page.locator(".case-hero img")).toHaveJSProperty("complete", true);
  await expect.poll(() => page.locator(".case-hero img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole("link", { name: /View the live Aurelia concept/ })).toHaveAttribute("href", "https://aurelia.alansahlanwork.workers.dev/");
  await expect(page).toHaveTitle(/Aurelia/);
});

test("history and return link lead back to selected work", async ({ page }) => {
  await page.goto("/");
  const link = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await link.scrollIntoViewIfNeeded();
  const startingY = await page.evaluate(() => window.scrollY);
  await link.click();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(link).toBeInViewport();
  await expect(link).toBeFocused();
  await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - startingY)).toBeLessThan(80);
  await page.goForward();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(page.getByRole("heading", { level: 1, name: "Aurelia" })).toBeFocused();
  await page.getByRole("link", { name: /Back to selected work/ }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect.poll(async () => Math.abs((await page.evaluate(() => window.scrollY)) - startingY)).toBeLessThan(80);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeInViewport();
});

test("modified click opens an Aurelia tab", async ({ page, context }) => {
  await page.goto("/");
  const link = page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ });
  await link.scrollIntoViewIfNeeded();
  const [newPage] = await Promise.all([context.waitForEvent("page"), link.click({ modifiers: ["Control"] })]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/\/work\/aurelia$/);
  await expect(page).toHaveURL(/\/$/);
});

test("reduced motion shows a static preview and responds to preference changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const preview = page.locator(".project-row").first().locator(".project-preview");
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
});

for (const width of [320, 390, 768, 1440]) {
  test(`Aurelia layouts fit ${width}px without horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".project-row").first().getByRole("heading", { name: "Aurelia" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width >= 768) {
      await page.locator(".project-row").first().getByRole("link", { name: /Aurelia/ }).hover();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    await page.goto("/work/aurelia");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test.describe("touch gallery", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("shows a compact Aurelia thumbnail and enters on one tap", async ({ page }) => {
    await page.goto("/");
    const row = page.locator(".project-row").first();
    const preview = row.locator(".project-preview");
    await expect.poll(() => preview.evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(150);
    await row.getByRole("link", { name: /Aurelia/ }).tap();
    await expect(page).toHaveURL(/\/work\/aurelia$/);
  });
});


test("direct case-study return focuses selected work", async ({ page }) => {
  await page.goto("/work/aurelia");
  await page.getByRole("link", { name: /Back to selected work/ }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work")).toBeFocused();
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeInViewport();
});
