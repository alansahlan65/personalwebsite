import { expect, test } from "@playwright/test";

test("the portrait request follows its capped display size at intermediate widths", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 650, height: 900 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto("/about");
  const image = page.locator(".about-portrait img");
  const metric = await image.evaluate(node => ({ width: node.getBoundingClientRect().width, requested: Number(new URL((node as HTMLImageElement).currentSrc).searchParams.get("w")), dpr: devicePixelRatio }));
  expect(metric.requested).toBeLessThanOrEqual(metric.width * metric.dpr * 1.5);
  await context.close();
});

test("enlarged tablet text uses a readable single-column professional story", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/about");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const capabilities = await page.getByRole("region", { name: "What I do", exact: true }).boundingBox();
  const experience = await page.getByRole("region", { name: "Experience", exact: true }).boundingBox();
  expect(experience!.y).toBeGreaterThan(capabilities!.y + capabilities!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0);
});

test("an enlarged explanation fits a short viewport and its content can scroll", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/about");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const research = page.getByRole("button", { name: "user research", exact: true });
  await research.scrollIntoViewIfNeeded();
  await research.focus();
  const tooltip = page.getByRole("tooltip");
  const bounds = await tooltip.boundingBox();
  const rail = await page.locator(".compact-menu-rail").boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(rail!.y + rail!.height + 15);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(375);
  const content = tooltip.locator("[data-preview-content]");
  expect(await content.evaluate(node => node.scrollHeight > node.clientHeight)).toBe(true);
  await page.keyboard.press("PageDown");
  expect(await content.evaluate(node => node.scrollTop)).toBeGreaterThan(0);
  await expect(research).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();
});

test("an unpinned explanation stays open while the pointer crosses into it", async ({ page }) => {
  await page.goto("/about");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const trigger = page.getByRole("button", { name: "user research", exact: true });
  await trigger.hover();
  const tooltip = page.getByRole("tooltip");
  const button = await trigger.boundingBox();
  const panel = await tooltip.boundingBox();
  const x = Math.max(button!.x, panel!.x) + 10;
  await page.mouse.move(x, button!.y + button!.height / 2);
  await page.mouse.move(x, panel!.y + 10, { steps: 12 });
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();
});

test("rotation cancels a held drag without changing the story", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  const card = page.locator("[data-front]");
  await expect(card).toHaveAttribute("data-draggable");
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  const x = box!.x + box!.width / 2, y = box!.y + box!.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x - 35, y + 65, { steps: 10 });
  await page.setViewportSize({ width: 844, height: 390 });
  await expect.poll(() => card.evaluate(node => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
    return Math.abs(matrix.m41) + Math.abs(matrix.m42);
  })).toBeLessThan(1);
  await page.mouse.up();
  await expect(card.getByRole("heading")).toHaveText("Marvel or DC?");
});

test("a card taller than the touch viewport allows native reading scroll", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 320 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/about");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const card = page.locator("[data-front]");
  await card.evaluate(node => node.scrollIntoView({ block: "start" }));
  await expect(card).toHaveAttribute("data-scroll");
  await expect(card).not.toHaveAttribute("data-draggable");
  const scrollBefore = await page.evaluate(() => scrollY);
  const box = await card.boundingBox();
  const session = await context.newCDPSession(page);
  const x = box!.x + box!.width / 2, y = 260;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let i = 1; i <= 10; i++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 70 * i / 10 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scrollBefore + 20);
  await expect(card.getByRole("heading")).toHaveText("Marvel or DC?");
  await context.close();
});
