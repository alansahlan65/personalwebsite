import { expect, test } from "@playwright/test";

test("direct Paylecta entry explains the client design contribution using original evidence", async ({ page }) => {
  await page.goto("/work/paylecta");
  await expect(page.getByRole("heading", { level: 1, name: "Paylecta" })).toBeVisible();
  await expect(page.getByText(/Sole UI\/UX designer for the dashboard/)).toBeVisible();
  await expect(page.getByText("No other designers.", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Design decisions", exact: true })).toBeVisible();
  const sequence = page.getByRole("region", { name: "Inside the design" });
  await expect(sequence.getByRole("article")).toHaveCount(3);
  await expect(sequence.getByText(/Source design mockups/)).toHaveCount(3);
  await expect(page.getByRole("link", { name: "Read the original Paylecta case study PDF" })).toHaveAttribute("href", "https://drive.google.com/file/d/19UDppHbm1QU3C_0gCycbTltVKUSxPxmi/view");
  await expect.poll(() => page.locator(".case-hero img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page).toHaveTitle("Paylecta | Alan Sahlan");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/work\/paylecta\/opengraph-image\.jpg/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Paylecta original client finance dashboard design/);
  const copy = await page.locator("main").innerText();
  expect(copy).not.toMatch(/35%|50%|45%|score of 90|Sarah Wijaya/);
  expect(copy).not.toMatch(/View the live|designed and built/);
});

test("gallery focus wins over cross-row hover and Paylecta has a single keyboard stop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  const rows = page.locator(".project-row");
  const paylecta = rows.nth(1);
  await page.keyboard.press("Tab");
  await paylecta.getByRole("link").focus();
  await rows.nth(0).getByRole("heading").hover();
  await expect(paylecta).toHaveAttribute("data-expanded", "true");
  await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(paylecta.getByRole("link")).not.toBeFocused();
  await expect(paylecta).toHaveAttribute("data-expanded", "false");
  await page.keyboard.press("Shift+Tab");
  await expect(paylecta.getByRole("link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1, name: "Paylecta" })).toBeFocused();
  await page.goBack();
  await expect(paylecta.getByRole("link")).toBeFocused();
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

test("Paylecta media advances, reverses, and exposes every image link to the keyboard", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/paylecta");
  const sequence = page.getByRole("region", { name: "Inside the design" });
  const panels = sequence.getByRole("article");
  const progress = sequence.getByRole("progressbar");
  await expect(progress).toBeVisible();
  const range = await sequence.evaluate(element => ({ start: element.getBoundingClientRect().top + window.scrollY, travel: element.getBoundingClientRect().height - window.innerHeight }));
  expect(range.travel).toBeGreaterThan(2000);
  for (const step of [0, 1, 2, 1, 0]) {
    await page.evaluate(({ y }) => window.scrollTo(0, y), { y: range.start + range.travel * step / 2 });
    await expect(progress).toHaveAttribute("value", String(step + 1));
    await expect(panels.nth(step)).toBeInViewport({ ratio: 0.95 });
  }
  const skip = sequence.getByRole("link", { name: "Skip to implementation considerations" });
  await skip.focus();
  for (let index = 0; index < 3; index++) {
    await page.keyboard.press("Tab");
    const link = panels.nth(index).getByRole("link");
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport({ ratio: 1 });
    await expect(panels.nth(index).locator("img")).toHaveAttribute("width", "1402");
    await expect(panels.nth(index).locator("img")).toHaveAttribute("height", "1081");
  }
  await page.keyboard.press("Shift+Tab");
  const [imagePage] = await Promise.all([context.waitForEvent("page"), page.keyboard.press("Enter")]);
  await imagePage.waitForLoadState();
  await expect(imagePage).toHaveURL(/\/images\/paylecta-customers.webp$/);
  await imagePage.close();
  await skip.click();
  await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeFocused();
  await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeInViewport();
});

test("Paylecta preserves focused content through motion, size, and forced-color changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/paylecta");
  const sequence = page.getByRole("region", { name: "Inside the design" });
  await page.evaluate(() => document.fonts.ready);
  await expect(sequence.getByRole("progressbar")).toBeVisible();
  const link = sequence.getByRole("article").nth(1).getByRole("link");
  await link.focus();
  await expect(link).toBeInViewport({ ratio: 1 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  await expect(link).toBeFocused();
  // Native scroll offsets round to whole pixels; allow less than half a pixel at the edge.
  await expect(link).toBeInViewport({ ratio: 0.99 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(link).toBeFocused();
  await expect(link).toBeInViewport({ ratio: 1 });
  await page.emulateMedia({ forcedColors: "active" });
  await expect(link).toHaveCSS("outline-style", "solid");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "none" });
  await expect(link).toBeInViewport({ ratio: 1 });
  const skip = sequence.getByRole("link", { name: "Skip to implementation considerations" });
  await skip.focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport({ ratio: 1 });
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeFocused();
});

for (const width of [320, 390, 768, 1440]) {
  test(`Paylecta retains all source media and fits ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/work/paylecta");
    await page.evaluate(() => document.fonts.ready);
    const sequence = page.getByRole("region", { name: "Inside the design" });
    if (width < 1000) await expect(sequence.getByRole("progressbar")).toBeHidden();
    for (const panel of await sequence.getByRole("article").all()) {
      await panel.getByRole("link").focus();
      const image = panel.getByRole("img");
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    await expect(sequence.getByRole("progressbar")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await sequence.getByRole("link", { name: "Skip to implementation considerations" }).click();
    await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeFocused();
  });
}

test.describe("touch Paylecta", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("one tap opens the case study with stacked media", async ({ page }) => {
    await page.goto("/#work");
    const row = page.locator('.project-row[data-project="paylecta"]');
    await expect(row.locator(".project-preview img").first()).toBeVisible();
    await row.getByRole("link").tap();
    await expect(page).toHaveURL(/\/work\/paylecta$/);
    const sequence = page.getByRole("region", { name: "Inside the design" });
    await expect(sequence.getByRole("progressbar")).toBeHidden();
    await sequence.getByRole("article").last().getByRole("img").scrollIntoViewIfNeeded();
    await expect(sequence.getByRole("article").last().getByRole("img")).toBeInViewport();
    await expect(page.locator(".site-cursor")).toBeHidden();
  });
});

test("without JavaScript Paylecta keeps the full case study and native destinations", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/work/paylecta");
  const sequence = page.getByRole("region", { name: "Inside the design" });
  await expect(sequence.getByRole("article")).toHaveCount(3);
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  for (const image of await sequence.getByRole("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeInViewport();
  }
  await page.getByRole("link", { name: "Back to selected work" }).last().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("link", { name: "Paylecta, Finance case study", exact: true })).toHaveAttribute("href", "/work/paylecta");
  await context.close();
});

test("Paylecta opens from one gallery link and returns to the saved selection", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const row = page.locator('.project-row[data-project="paylecta"]');
  const project = row.getByRole("link", { name: "Paylecta, Finance case study", exact: true });
  await expect(row.getByRole("link")).toHaveCount(1);
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
