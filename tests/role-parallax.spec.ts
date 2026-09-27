import { expect, test, type Page } from "@playwright/test";

async function positions(page: Page) {
  return page.locator(".role-track").evaluateAll((tracks) => tracks.map((track) => track.getBoundingClientRect().x));
}
async function scrollTo(page: Page, y: number) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

test("role tracks follow scroll directly, alternate directions, reverse and stop", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".role-track")).toHaveCount(3);
  const y = await page.locator(".roles").evaluate((section) => section.getBoundingClientRect().top + window.scrollY - 450);
  await scrollTo(page, y);
  const start = await positions(page);
  for (const distance of [20, 160, 400]) {
    await scrollTo(page, y + distance);
    const next = await positions(page);
    expect(next[0]).toBeLessThan(start[0]);
    expect(next[1]).toBeGreaterThan(start[1]);
    expect(next[2]).toBeLessThan(start[2]);
    await scrollTo(page, y);
    const reversed = await positions(page);
    reversed.forEach((x, i) => expect(Math.abs(x - start[i])).toBeLessThan(1));
  }
  await page.waitForTimeout(350);
  const stopped = await positions(page);
  stopped.forEach((x, i) => expect(Math.abs(x - start[i])).toBeLessThan(0.1));
});

async function expectCovered(page: Page, width: number) {
  const bounds = await page.locator(".role-track").evaluateAll((tracks) => tracks.map((track) => {
    const rect = track.getBoundingClientRect();
    return { left: rect.left, right: rect.right };
  }));
  for (const boundsOfTrack of bounds) {
    expect(boundsOfTrack.left).toBeLessThanOrEqual(0);
    expect(boundsOfTrack.right).toBeGreaterThanOrEqual(width);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  const readable = await page.locator(".role-track").evaluateAll((tracks) => tracks.map((track) =>
    Array.from(track.querySelectorAll("p, .role-unit > span")).some((label) => {
      const rect = label.getBoundingClientRect();
      return rect.width > 0 && rect.left >= 0 && rect.right <= window.innerWidth;
    })));
  expect(readable).toEqual([true, true, true]);
}

for (const width of [320, 390, 650, 768, 1000, 1440]) {
  test(`role repetitions cover travel without page overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const roles = page.getByRole("region", { name: "Design / Build / Refine" });
    await expect(roles.locator("p")).toHaveCount(3);
    await expect(roles.locator(".role-unit[aria-hidden='true']").first()).toHaveAttribute("aria-hidden", "true");
    const start = await roles.evaluate((section) => section.getBoundingClientRect().top + window.scrollY - window.innerHeight);
    const height = await roles.evaluate((section) => section.getBoundingClientRect().height);
    for (const y of [Math.max(0, start), start + 450, start + 900, start + 900 + height]) {
      await scrollTo(page, y);
      await expectCovered(page, width);
    }
    for (const image of await roles.locator(".role-unit:first-child img").all()) {
      await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
      await expect(image).toHaveAttribute("alt", "");
    }
    const snapshot = await roles.ariaSnapshot();
    for (const label of ["Product Designer", "Design Engineer", "Interaction Designer"]) {
      expect(snapshot.split(label).length - 1).toBe(1);
    }
  });
}

test("resize and changed font metrics recalculate coverage at the current scroll position", async ({ page }) => {
  await page.goto("/");
  await scrollTo(page, 680);
  const before = await positions(page);
  await page.setViewportSize({ width: 320, height: 700 });
  await expect.poll(() => positions(page)).not.toEqual(before);
  await expectCovered(page, 320);
  await page.evaluate(async () => {
    const font = new FontFace("Role metric check", "local('Courier New'), local('Menlo'), local('DejaVu Sans Mono'), local('Liberation Mono')");
    await font.load();
    document.fonts.add(font);
    document.querySelectorAll<HTMLElement>(".role-unit, .role-measure").forEach((element) => element.style.fontFamily = "'Role metric check'");
    await document.fonts.ready;
  });
  await expectCovered(page, 320);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expectCovered(page, 1440);
  const y = await page.evaluate(() => window.scrollY);
  const current = await positions(page);
  await scrollTo(page, y + 30);
  await scrollTo(page, y);
  (await positions(page)).forEach((x, i) => expect(Math.abs(x - current[i])).toBeLessThan(1));
});

for (const reducedAtLoad of [true, false]) {
  test(`reduced motion stays readable and stationary ${reducedAtLoad ? 'at load' : 'when enabled'}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: reducedAtLoad ? "reduce" : "no-preference" });
    await page.goto("/");
    await scrollTo(page, 700);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    const labels = page.locator(".role-lines p");
    await expect(labels).toHaveCount(3);
    for (const label of await labels.all()) {
      await expect(label).toBeVisible();
      const rect = await label.boundingBox();
      expect(rect!.x).toBeGreaterThanOrEqual(0);
      expect(rect!.x + rect!.width).toBeLessThanOrEqual(390);
    }
    await expect(page.locator(".role-unit[aria-hidden='true']").first()).toBeHidden();
    const first = await positions(page);
    await scrollTo(page, 900);
    expect(await positions(page)).toEqual(first);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expectCovered(page, 390);
    await page.addStyleTag({ content: "html { font-size: 100%; }" });
    await expect.poll(() => positions(page)).not.toEqual(first);
    await expectCovered(page, 390);
  });
}

test("touch gestures scroll through the roles and reach the project journey", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  await scrollTo(page, 620);
  const start = await positions(page);
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 180, y: 600 }] });
  for (let y = 580; y >= 400; y -= 20) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 180, y }] });
    await page.waitForTimeout(20);
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(700);
  await expect.poll(() => positions(page)).not.toEqual(start);
  await expect.poll(async () => {
    const before = await page.evaluate(() => window.scrollY);
    await page.waitForTimeout(150);
    return (await page.evaluate(() => window.scrollY)) === before;
  }).toBe(true);
  const project = page.getByRole("link", { name: "Aurelia, Hospitality case study" });
  // Finish the simulated fling and bring the intended target into view before tapping.
  await project.scrollIntoViewIfNeeded();
  const targetY = await page.evaluate(() => window.scrollY);
  await scrollTo(page, targetY);
  await project.tap();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await page.getByRole("link", { name: /Back to selected work/ }).first().tap();
  await expect(page.locator("#work")).toBeFocused();
  await expect(project).toBeInViewport();
  await context.close();
});

test("roles, menu precedence, keyboard gallery ownership and project return share one journey", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await scrollTo(page, 720);
  await page.locator(".role-unit").first().locator("img").hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "image");
  await page.locator(".compact-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await dialog.getByRole("link", { name: "Work", exact: true }).hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "dot");
  await expect(page.locator(".site-cursor-arrow")).toBeHidden();
  await dialog.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page.locator("#work")).toBeFocused();
  await page.keyboard.press("Tab");
  const allWork = page.getByRole("link", { name: "View all work on Behance (opens in a new tab)", exact: true });
  if (await allWork.count()) {
    await expect(allWork).toBeFocused();
    await page.keyboard.press("Tab");
  }
  const project = page.getByRole("link", { name: "Aurelia, Hospitality case study" });
  await expect(project).toBeFocused();
  await page.getByRole("heading", { name: "Paylecta" }).hover();
  await expect(project).toBeFocused();
  await expect.poll(() => project.locator(".project-preview").evaluate((element) => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  const y = await page.evaluate(() => window.scrollY);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await expect(page.getByRole("heading", { name: "Aurelia", exact: true })).toBeFocused();
  await page.getByRole("link", { name: /Back to selected work/ }).first().click();
  await expect(page.locator("#work")).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(y, 0);
  await scrollTo(page, 720);
  await expectCovered(page, 1440);
  expect(errors).toEqual([]);
});
