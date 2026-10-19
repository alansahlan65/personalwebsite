import { expect, test } from "@playwright/test";

test("direct Munchpal entry presents the client design case with original sources", async ({ page }) => {
  await page.goto("/work/munchpal");
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeVisible();
  await expect(page.locator(".case-facts").getByText(/Client design project/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Read the original Munchpal case study PDF" })).toHaveAttribute("href", "https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view");
  await expect(page.getByRole("link", { name: "Explore the original MunchPal prototype" })).toHaveAttribute("href", /figma\.com\/proto\/Xsj8X9CcL5SW6CoILaZFH3\/MunchPal/);
  const media = page.getByRole("region", { name: "From research to handoff" });
  await expect(media.getByRole("article")).toHaveCount(4);
  await expect.poll(() => page.locator(".case-hero img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  const copy = await page.locator("main").innerText();
  expect(copy).not.toMatch(/99[.,]16|0[.,]084|96[.,]01|12 seconds|20 participants|excellent across/);
  await expect(page).toHaveTitle("Munchpal | Alan Sahlan");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/work\/munchpal\/opengraph-image\.jpg/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveCount(1);
});

test("Munchpal is one local gallery destination", async ({ page }) => {
  await page.goto("/#work");
  const row = page.locator('.project-row[data-project="munchpal"]');
  const link = row.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true });
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute("href", "/work/munchpal");
  await link.click();
  await expect(page).toHaveURL(/\/work\/munchpal$/);
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
});

test("keyboard and pointer traversal keep one gallery preview active", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  const rows = page.locator(".project-row");
  await rows.first().getByRole("link").focus();
  for (const slug of ["aurelia", "paylecta", "pawfriend", "munchpal"]) {
    const row = page.locator(`.project-row[data-project="${slug}"]`);
    await expect(row.getByRole("link")).toBeFocused();
    await expect(row.getByRole("link")).toHaveAttribute("href", `/work/${slug}`);
    await expect(row).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
    if (slug !== "munchpal") await page.keyboard.press("Tab");
  }
  const munchpal = rows.nth(3);
  await rows.first().getByRole("heading").hover();
  await expect(munchpal.getByRole("link")).toBeFocused();
  await expect(munchpal).toHaveAttribute("data-expanded", "true");
  await page.locator("#work").focus();
  await page.mouse.move(0, 0);
  for (const index of [0, 3, 1, 3, 2, 3]) {
    await rows.nth(index).getByRole("heading").hover();
    await expect(rows.nth(index)).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
  }
  await expect.poll(() => munchpal.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
});

test("shared Munchpal entry and native new-tab visit preserve their destinations", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const project = page.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate(e => e.getBoundingClientRect().width)).toBeGreaterThan(300);
  await project.locator("img").last().hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "action-image");
  await project.locator("img").last().click();
  await expect(page).toHaveURL(/\/work\/munchpal$/);
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(a => {
    const effect = a.effect as KeyframeEffect | null;
    return effect?.pseudoElement?.includes("view-transition-group(munchpal-image)") && a.playState === "running";
  })), { intervals: [10, 10, 20] }).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
  await page.goto("/#work");
  const [tab] = await Promise.all([context.waitForEvent("page"), project.click({ modifiers: ["Control"] })]);
  await tab.waitForLoadState();
  await expect(tab).toHaveURL(/\/work\/munchpal$/);
  await expect(page).toHaveURL(/\/#work$/);
  await tab.getByRole("link", { name: "Back to selected work", exact: true }).first().click();
  await expect(tab.locator("#work")).toBeFocused();
  await tab.close();
});

test("four source panels progress and reverse, with image actions and Skip reachable", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/munchpal");
  const sequence = page.getByRole("region", { name: "From research to handoff" });
  const panels = sequence.getByRole("article");
  const progress = sequence.getByRole("progressbar");
  await expect(progress).toBeVisible();
  const range = await sequence.evaluate(e => ({ start: e.getBoundingClientRect().top + scrollY, travel: e.getBoundingClientRect().height - innerHeight }));
  expect(range.travel).toBeGreaterThan(3000);
  for (const step of [0, 1, 2, 3, 2, 0]) {
    await page.evaluate(({ start, travel, step }) => scrollTo(0, start + travel * step / 3), { ...range, step });
    await expect(progress).toHaveAttribute("value", String(step + 1));
    await expect(panels.nth(step)).toBeInViewport({ ratio: 0.95 });
  }
  const skip = sequence.getByRole("link", { name: "Skip to implementation considerations" });
  await skip.focus();
  for (const panel of await panels.all()) {
    await page.keyboard.press("Tab");
    await expect(panel.getByRole("link")).toBeFocused();
    await expect(panel.getByRole("link")).toBeInViewport({ ratio: 1 });
    await expect.poll(() => panel.getByRole("img").evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
  }
  const [imageTab] = await Promise.all([context.waitForEvent("page"), panels.last().getByRole("link").click()]);
  await imageTab.waitForLoadState();
  await expect(imageTab).toHaveURL(/\/images\/munchpal-feedback.webp$/);
  await imageTab.close();
  await skip.click();
  await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeFocused();
});

test("runtime motion and size changes preserve the focused media action", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/munchpal");
  await page.evaluate(() => document.fonts.ready);
  const sequence = page.getByRole("region", { name: "From research to handoff" });
  await expect(sequence.getByRole("progressbar")).toBeVisible();
  const action = sequence.getByRole("article").nth(2).getByRole("link");
  await action.focus();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  await expect(action).toBeFocused();
  await expect(action).toBeInViewport({ ratio: 0.99 });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(action).toBeInViewport({ ratio: 1 });
  await page.emulateMedia({ forcedColors: "active" });
  await expect(action).toHaveCSS("outline-style", "solid");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "none" });
  await expect(action).toBeInViewport({ ratio: 1 });
  const skip = sequence.getByRole("link", { name: "Skip to implementation considerations" });
  await skip.focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport({ ratio: 1 });
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeFocused();
});

for (const width of [320, 390, 768, 1440]) {
  test(`source panels and enlarged text remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/work/munchpal");
    await page.evaluate(() => document.fonts.ready);
    const sequence = page.getByRole("region", { name: "From research to handoff" });
    for (const panel of await sequence.getByRole("article").all()) {
      await panel.getByRole("link").focus();
      await expect.poll(() => panel.getByRole("img").evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    await expect(sequence.getByRole("progressbar")).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await sequence.getByRole("link", { name: "Skip to implementation considerations" }).click();
    await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeFocused();
  });
}

test.describe("touch entry", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test("one tap opens Munchpal with the complete media stack", async ({ page }) => {
    await page.goto("/#work");
    await page.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true }).tap();
    await expect(page).toHaveURL(/\/work\/munchpal$/);
    const sequence = page.getByRole("region", { name: "From research to handoff" });
    await expect(sequence.getByRole("progressbar")).toBeHidden();
    await sequence.getByRole("article").last().getByRole("img").scrollIntoViewIfNeeded();
    await expect(sequence.getByRole("article").last()).toBeInViewport();
    await expect(page.locator(".site-cursor")).toBeHidden();
  });
});

test("without JavaScript the complete case remains readable with native destinations", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/work/munchpal");
  const sequence = page.getByRole("region", { name: "From research to handoff" });
  await expect(sequence.getByRole("article")).toHaveCount(4);
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  for (const image of await sequence.getByRole("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeInViewport();
  }
  await page.getByRole("link", { name: "Back to selected work", exact: true }).last().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true })).toHaveAttribute("href", "/work/munchpal");
  await context.close();
});

test("source media and social preview load without missing pointer actions", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/work/munchpal");
  await expect(page.locator("[data-magnet] [data-magnet]")).toHaveCount(0);
  expect(await page.locator(".case-study a[href], .case-study button").evaluateAll(elements => elements.filter(e => !e.hasAttribute("data-magnet")).map(e => e.textContent))).toEqual([]);
  await expect(page.locator('.case-hero img')).toHaveCount(1);
  await expect(page.locator('.case-media-panel img')).toHaveCount(4);
  const social = await page.request.get("/work/munchpal/opengraph-image.jpg");
  expect(social.status()).toBe(200);
  expect(social.headers()["content-type"]).toContain("image/jpeg");
  expect(errors).toEqual([]);
});

test("gallery Back, Forward, and return preserve Munchpal selection and position", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const project = page.getByRole("link", { name: "Munchpal, Food sharing case study", exact: true });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  const heading = project.getByRole("heading", { name: "Munchpal", exact: true });
  await heading.click({ trial: true });
  await project.evaluate(link => link.addEventListener("click", () => {
    sessionStorage.setItem("munchpal-test-departure-y", String(scrollY));
  }, { capture: true, once: true }));
  await heading.click();
  const y = Number(await page.evaluate(() => sessionStorage.getItem("munchpal-test-departure-y")));
  await expect(page).toHaveURL(/\/work\/munchpal$/);
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
  await page.goBack();
  await expect(project).toBeFocused();
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1, name: "Munchpal", exact: true })).toBeFocused();
  await page.getByRole("link", { name: "Back to selected work", exact: true }).first().click();
  await expect(page.locator("#work")).toBeFocused();
  await expect.poll(async () => Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThanOrEqual(1);
});
