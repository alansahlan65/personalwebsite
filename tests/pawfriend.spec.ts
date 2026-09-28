import { expect, test } from "@playwright/test";

test("direct PawFriend entry explains the concept using observed live workflows", async ({ page }) => {
  await page.goto("/work/pawfriend");
  await expect(page.getByRole("heading", { level: 1, name: "PawFriend", exact: true })).toBeVisible();
  await expect(page.getByText("Self-initiated concept", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "View the live PawFriend concept", exact: true })).toHaveAttribute("href", "https://pawfriend-topaz.vercel.app/");
  await expect(page.getByRole("link", { name: "View PawFriend source code", exact: true })).toHaveAttribute("href", "https://github.com/alansahlan65/pawfriend");
  await expect(page.getByRole("heading", { name: "Design decisions", exact: true })).toBeVisible();
  const sequence = page.getByRole("region", { name: "From browsing to a first visit", exact: true });
  await expect(sequence.getByRole("article")).toHaveCount(3);
  await expect(sequence.getByText(/Live concept, captured 27 September 2026/)).toHaveCount(3);
  await expect.poll(() => page.locator(".case-hero img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page).toHaveTitle("PawFriend | Alan Sahlan");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/work\/pawfriend\/opengraph-image\.jpg/);
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveCount(1);
  const copy = await page.locator("main").innerText();
  expect(copy).not.toMatch(/increased adoptions|successful adoptions|conversion rate|tested with \d/);
});

test("keyboard traversal keeps one project active and focus overrides sibling hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  const rows = page.locator(".project-row");
  const link = rows.nth(2).getByRole("link");
  await page.keyboard.press("Tab");
  await rows.first().getByRole("link").focus();
  for (const slug of ["aurelia", "paylecta", "pawfriend"]) {
    const row = page.locator(`.project-row[data-project="${slug}"]`);
    await expect(row.getByRole("link")).toBeFocused();
    await expect(row.getByRole("link")).toHaveAttribute("href", `/work/${slug}`);
    await expect(row).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
    if (slug !== "pawfriend") await page.keyboard.press("Tab");
  }
  await expect(rows.nth(2).getByRole("link")).toHaveCount(1);
  await rows.first().getByRole("heading").hover();
  await expect(link).toBeFocused();
  await expect(rows.nth(2)).toHaveAttribute("data-expanded", "true");
  await page.locator("#work").focus();
  await page.mouse.move(0, 0);
  for (const index of [0, 2, 1, 2, 0, 2]) {
    await rows.nth(index).getByRole("heading").hover();
    await expect(rows.nth(index)).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
  }
});

test("shared PawFriend entry and native new-tab visits keep their destinations", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const project = page.getByRole("link", { name: "PawFriend, Pet adoption case study", exact: true });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate(e => e.getBoundingClientRect().width)).toBeGreaterThan(300);
  await project.locator("img").last().hover();
  await expect(page.locator(".site-cursor")).toHaveAttribute("data-mode", "action-image");
  await project.locator("img").last().click();
  await expect(page).toHaveURL(/\/work\/pawfriend$/);
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(a => {
    const effect = a.effect as KeyframeEffect | null;
    return effect?.pseudoElement?.includes("view-transition-group(pawfriend-image)") && a.playState === "running";
  })), { intervals: [10, 10, 20] }).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "PawFriend", exact: true })).toBeFocused();
  await page.goto("/#work");
  const [tab] = await Promise.all([context.waitForEvent("page"), project.click({ modifiers: ["Control"] })]);
  await tab.waitForLoadState();
  await expect(tab).toHaveURL(/\/work\/pawfriend$/);
  await expect(page).toHaveURL(/\/#work$/);
  await tab.getByRole("link", { name: "Back to selected work", exact: true }).first().click();
  await expect(tab.locator("#work")).toBeFocused();
  await tab.close();
});

test("media progresses, reverses, and keeps screenshot actions and Skip reachable", async ({ page, context }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  const panels = sequence.getByRole("article");
  const progress = sequence.getByRole("progressbar");
  await expect(progress).toBeVisible();
  const range = await sequence.evaluate(e => ({ start: e.getBoundingClientRect().top + scrollY, travel: e.getBoundingClientRect().height - innerHeight }));
  expect(range.travel).toBeGreaterThan(2000);
  for (const step of [0, 1, 2, 1, 0]) {
    await page.evaluate(({ start, travel, step }) => scrollTo(0, start + travel * step / 2), { ...range, step });
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
  await expect(imageTab).toHaveURL(/\/images\/pawfriend-prepare.webp$/);
  await imageTab.close();
  await skip.click();
  await expect(page.getByRole("heading", { name: "Implementation considerations", exact: true })).toBeFocused();
});

test("runtime motion and size changes preserve the focused media action and toolbar", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/pawfriend");
  await page.evaluate(() => document.fonts.ready);
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  await expect(sequence.getByRole("progressbar")).toBeVisible();
  const action = sequence.getByRole("article").nth(1).getByRole("link");
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
  test(`source media and enlarged text remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/work/pawfriend");
    await page.evaluate(() => document.fonts.ready);
    const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
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
  test("one tap opens PawFriend and the full media stack", async ({ page }) => {
    await page.goto("/#work");
    await page.getByRole("link", { name: "PawFriend, Pet adoption case study", exact: true }).tap();
    await expect(page).toHaveURL(/\/work\/pawfriend$/);
    const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
    await expect(sequence.getByRole("progressbar")).toBeHidden();
    await sequence.getByRole("article").last().getByRole("img").scrollIntoViewIfNeeded();
    await expect(sequence.getByRole("article").last()).toBeInViewport();
    await expect(page.locator(".site-cursor")).toBeHidden();
  });
});

test("without JavaScript the case study retains media and native return links", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  await expect(sequence.getByRole("article")).toHaveCount(3);
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  for (const image of await sequence.getByRole("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeInViewport();
  }
  await page.getByRole("link", { name: "Back to selected work", exact: true }).last().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("link", { name: "PawFriend, Pet adoption case study", exact: true })).toHaveAttribute("href", "/work/pawfriend");
  await context.close();
});

test("native source recording plays on request and all new actions have pointer treatment", async ({ page }) => {
  const errors: string[] = [];
  const eagerVideoRequests: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => { if (request.url().endsWith("pawfriend-observed-flow.webm")) eagerVideoRequests.push(request.url()); });
  await page.goto("/work/pawfriend");
  await expect(page.locator("[data-magnet] [data-magnet]")).toHaveCount(0);
  expect(await page.locator(".case-study a[href], .case-study button").evaluateAll(elements => elements.filter(e => !e.hasAttribute("data-magnet")).map(e => e.textContent))).toEqual([]);
  const video = page.getByLabel("PawFriend live concept browsing and shortlist recording");
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("preload", "none");
  await expect(video).not.toHaveAttribute("autoplay", "");
  expect(eagerVideoRequests).toEqual([]);
  await video.scrollIntoViewIfNeeded();
  await video.evaluate((v: HTMLVideoElement) => v.play());
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0);
  expect(await video.evaluate((v: HTMLVideoElement) => v.videoWidth)).toBe(1440);
  await video.evaluate((v: HTMLVideoElement) => v.pause());
  expect(errors).toEqual([]);
});

test("PawFriend gallery entry and return preserve selection and scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const project = page.getByRole("link", { name: "PawFriend, Pet adoption case study", exact: true });
  await project.hover();
  await expect.poll(() => project.locator(".project-preview").evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(300);
  await expect.poll(() => project.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  const heading = project.getByRole("heading", { name: "PawFriend", exact: true });
  await expect(heading).toBeInViewport({ ratio: 1 });
  // Record the actual click position after the expanding row has settled.
  await heading.click({ trial: true });
  await project.evaluate(link => link.addEventListener("click", () => {
    sessionStorage.setItem("pawfriend-test-departure-y", String(scrollY));
  }, { capture: true, once: true }));
  await heading.click();
  const y = Number(await page.evaluate(() => sessionStorage.getItem("pawfriend-test-departure-y")));
  await expect(page).toHaveURL(/\/work\/pawfriend$/);
  await expect(page.getByRole("heading", { level: 1, name: "PawFriend", exact: true })).toBeFocused();
  await page.goBack();
  await expect(project).toBeFocused();
  await page.goForward();
  await expect(page.getByRole("heading", { level: 1, name: "PawFriend", exact: true })).toBeFocused();
  await page.getByRole("link", { name: "Back to selected work", exact: true }).first().click();
  await expect(page.locator("#work")).toBeFocused();
  await expect.poll(async () => Math.abs((await page.evaluate(() => scrollY)) - y)).toBeLessThanOrEqual(1);
});
