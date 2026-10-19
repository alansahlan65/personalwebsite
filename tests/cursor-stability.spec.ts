import { expect, test } from "@playwright/test";

test("the dot follows within the next frame and stays custom across reading text", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  await page.mouse.move(30, 350);
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  const sample = await page.evaluate(async () => {
    document.body.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: 430, clientY: 350 }));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const rect = document.querySelector(".site-cursor")!.getBoundingClientRect();
    return { error: Math.abs(rect.x + rect.width / 2 - 430), width: rect.width };
  });
  expect(sample.error).toBeLessThan(2);
  expect(sample.width).toBeLessThanOrEqual(7.1);
  await page.locator("#hero-title").hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await expect(page.locator("#hero-title")).toHaveCSS("cursor", "none");
});

test("disclosures and their descendants never show a native pointer beside the dot", async ({ page }) => {
  await page.goto("/work/aurelia");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const summary = page.locator("summary").first();
  await summary.hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await expect(summary).toHaveCSS("cursor", "none");
});

test("the dot stays visible while editing and selecting form text", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  await page.getByLabel("Your name").hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await expect(page.getByLabel("Your name")).toHaveCSS("cursor", "none");
  await page.getByLabel("Your name").fill("Alan Sahlan");
  await page.getByLabel("Your name").selectText();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await page.locator('label[for="contact-name"]').hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
});

test("pending disabled controls keep the dot instead of a native wait cursor", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => new Promise<void>(() => undefined) },
    });
  });
  await page.goto("/contact");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const copy = page.getByRole("button", { name: "Copy email", exact: true });
  await copy.click();
  await expect(copy).toBeDisabled();
  await copy.hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await expect(copy).toHaveCSS("cursor", "none");
  await page.getByLabel("Your name").fill("Alan Sahlan");
  await expect(copy).toBeEnabled();
  await copy.hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
});

test("high-rate pointer input coalesces and the dot does no idle rendering", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  await page.mouse.move(20, 400);
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  const result = await page.evaluate(async () => {
    const cursor = document.querySelector(".site-cursor")!;
    let writes = 0;
    const observer = new MutationObserver(records => { writes += records.filter(r => r.attributeName === "style").length; });
    observer.observe(cursor, { attributes: true });
    for (let i = 0; i < 200; i++) document.body.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: 20 + i, clientY: 400 }));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const inputWrites = writes;
    const rect = cursor.getBoundingClientRect();
    await new Promise(resolve => setTimeout(resolve, 150));
    observer.disconnect();
    return { inputWrites, idleWrites: writes - inputWrites, x: rect.x + rect.width / 2 };
  });
  expect(result.inputWrites).toBeLessThanOrEqual(2);
  expect(result.idleWrites).toBe(0);
  expect(result.x).toBeCloseTo(219, 1);
});

test("the dot stays visible over video controls and return links", async ({ page }) => {
  await page.goto("/work/aurelia");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  await page.locator("#aurelia-implementation details > summary").click();
  const video = page.locator("video");
  await expect(video).toHaveAttribute("controls", "");
  await video.hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await expect(page.locator("html")).toHaveAttribute("data-cursor-ready", "true");
  await page.getByRole("link", { name: "Back to selected work", exact: true }).last().hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
});

test("dragging to highlight copy keeps the dot before and after releasing the pointer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const copy = page.locator(".about-copy p");
  await copy.scrollIntoViewIfNeeded();
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "1");
  const box = (await copy.boundingBox())!;
  await page.mouse.move(box.x + 2, box.y + 12);
  await page.mouse.down();
  await page.mouse.move(box.x + Math.min(box.width - 2, 180), box.y + 12, { steps: 12 });
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString().length ?? 0)).toBeGreaterThan(0);
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await page.mouse.up();
  await expect(page.locator("html")).toHaveAttribute("data-cursor-ready", "true");
  await expect(copy).toHaveCSS("cursor", "none");
  await page.mouse.move(box.x + 30, box.y + 40);
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
});
