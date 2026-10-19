import { expect, test, type Page } from "@playwright/test";
import { tabTo } from "./helpers/media-keyboard";

async function scrollTo(page: Page, y: number) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
}

test("vertical scroll advances PawFriend media, reports progress, reverses and stops", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  await expect(sequence.getByRole("article")).toHaveCount(3);
  await expect(sequence).toHaveAttribute("data-horizontal", "true");
  const start = await sequence.evaluate((element) => element.getBoundingClientRect().top + window.scrollY);
  const distance = await sequence.evaluate((element) => element.getBoundingClientRect().height - window.innerHeight);
  expect(distance).toBeGreaterThan(2000);
  const progress = sequence.getByRole("progressbar", { name: "Media sequence progress" });
  await scrollTo(page, start);
  await expect(progress).toHaveAttribute("value", "1");
  const first = sequence.getByRole("article").first();
  const initial = (await first.boundingBox())!.x;
  await scrollTo(page, start + distance / 2);
  await expect(progress).toHaveAttribute("value", "2");
  await expect(sequence.getByRole("article").nth(1)).toBeInViewport({ ratio: 0.95 });
  const middle = (await first.boundingBox())!.x;
  expect(middle).toBeLessThan(initial - 1000);
  await page.waitForTimeout(250);
  expect((await first.boundingBox())!.x).toBeCloseTo(middle, 1);
  await scrollTo(page, start + distance);
  await expect(progress).toHaveAttribute("value", "3");
  await expect(sequence.getByRole("article").nth(2)).toBeInViewport({ ratio: 0.95 });
  await scrollTo(page, start);
  await expect(progress).toHaveAttribute("value", "1");
  expect((await first.boundingBox())!.x).toBeCloseTo(initial, 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1440);
});

test("keyboard visitors reach each media panel and skip to focused subsequent content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  const skip = sequence.getByRole("link", { name: "Skip to build notes" });
  await skip.focus();
  for (let index = 0; index < 3; index++) {
    await tabTo(page, sequence.getByRole("article").nth(index).getByRole("link", { includeHidden: true }));
    await expect(sequence.getByRole("article").nth(index).getByRole("link", { includeHidden: true })).toBeFocused();
    await expect(sequence.getByRole("article").nth(index).getByRole("link", { includeHidden: true })).toBeInViewport({ ratio: 1 });
    const box = await sequence.getByRole("article").nth(index).getByRole("link", { includeHidden: true }).boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1440);
  }
  await tabTo(page, sequence.getByRole("article").nth(1).getByRole("link", { includeHidden: true }), true);
  await expect(sequence.getByRole("article").nth(1).getByRole("link", { includeHidden: true })).toBeFocused();
  await expect(sequence.getByRole("article").nth(1).getByRole("link", { includeHidden: true })).toBeInViewport({ ratio: 1 });
  await skip.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#pawfriend-implementation$/);
  await expect(page.locator("#pawfriend-implementation")).toBeFocused();
  await expect(page.locator("#pawfriend-implementation")).toBeInViewport();
});

test("preference and viewport changes keep the focused panel reachable in equivalent stacked content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  const link = sequence.getByRole("article").nth(1).locator("summary");
  await link.focus();
  await expect(link).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(link).toBeFocused();
  await expect(link).toBeInViewport();
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  for (const width of [390, 768, 1000, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(link).toBeFocused();
  await expect(link).toBeInViewport();
  await expect(sequence.getByRole("progressbar")).toHaveAttribute("value", "2");
});

test("focused toolbar skip stays reachable through layout and motion changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  const skip = sequence.getByRole("link", { name: "Skip to build notes" });
  const middle = async () => {
    await expect(sequence).toHaveAttribute("data-horizontal", "true");
    const y = await sequence.evaluate((element) => element.getBoundingClientRect().top + window.scrollY + (element.getBoundingClientRect().height - window.innerHeight) / 2);
    await scrollTo(page, y);
    await skip.focus();
    await expect(sequence.getByRole("progressbar")).toHaveAttribute("value", "2");
  };
  await middle();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport({ ratio: 1 });
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(skip).toBeInViewport({ ratio: 1 });
  await middle();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport({ ratio: 1 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(skip).toBeInViewport({ ratio: 1 });
  await page.keyboard.press("Enter");
  await expect(page.locator("#pawfriend-implementation")).toBeFocused();
});

for (const width of [320, 390, 768, 999, 1000, 1440]) {
  test(`the case study fits ${width}px with equivalent media and usable destinations`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/work/pawfriend");
    const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
    const articles = sequence.getByRole("article");
    await expect(articles).toHaveCount(3);
    for (const article of await articles.all()) {
      await expect(article.getByRole("heading", { level: 3 })).toBeVisible();
      await expect(article.locator(".case-media-crop img")).not.toHaveAttribute("alt", "");
      await article.locator("summary").focus();
      await expect(article.locator("summary")).toBeInViewport();
      await expect.poll(() => article.locator(".case-media-crop img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    if (width < 1000) {
      const boxes = await articles.evaluateAll((els) => els.map((el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y }; }));
      expect(boxes[1].x).toBeCloseTo(boxes[0].x, 0);
      expect(boxes[1].y).toBeGreaterThan(boxes[0].y);
      expect(boxes[2].y).toBeGreaterThan(boxes[1].y);
      await expect(sequence.getByRole("progressbar")).toBeHidden();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    await sequence.getByRole("link", { name: "Skip to build notes" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#pawfriend-implementation")).toBeFocused();
  });
}

test("reduced motion at load, enlarged text, and short viewports show readable stacked media", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await page.setViewportSize({ width: 390, height: 844 });
  for (const article of await sequence.getByRole("article").all()) {
    await article.locator("summary").focus();
    await expect(article.locator("summary")).toBeInViewport();
    const heading = await article.getByRole("heading").boundingBox();
    expect(heading!.x).toBeGreaterThanOrEqual(0);
    expect(heading!.x + heading!.width).toBeLessThanOrEqual(390);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  await page.addStyleTag({ content: "html { font-size: 100%; }" });
  await page.setViewportSize({ width: 1440, height: 600 });
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  expect(errors).toEqual([]);
});

test("late media and resize preserve the focused panel and a working skip", async ({ page }) => {
  let releaseImage: () => void = () => {};
  const ready = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route("**/images/pawfriend-shortlist.webp", async (route) => {
    await ready;
    await route.continue();
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/work/pawfriend", { waitUntil: "domcontentloaded" });
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  const article = sequence.getByRole("article").nth(1);
  const link = article.locator("summary");
  await expect(sequence.getByRole("progressbar")).toBeVisible();
  await link.focus();
  await expect(link).toBeInViewport();
  const before = await article.locator(".case-media-crop img").boundingBox();
  releaseImage();
  await expect.poll(() => article.locator(".case-media-crop img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  const after = await article.locator(".case-media-crop img").boundingBox();
  expect(after!.height).toBeCloseTo(before!.height, 0);
  await page.setViewportSize({ width: 1000, height: 900 });
  await expect(link).toBeFocused();
  await expect(link).toBeInViewport();
  await expect(sequence.getByRole("progressbar")).toHaveAttribute("value", "2");
  await sequence.getByRole("link", { name: "Skip to build notes" }).focus();
    await page.keyboard.press("Enter");
  await expect(page.locator("#pawfriend-implementation")).toBeFocused();
});

test("leaving and returning to PawFriend clears pinning and preserves normal navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  await sequence.getByRole("article").nth(2).locator("summary").focus();
  await page.locator(".compact-menu-trigger").click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: /Hi, I.m Alan/ })).toBeFocused();
  await expect(sequence).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goBack();
  await expect(page).toHaveURL(/\/work\/pawfriend$/);
  await expect(sequence.getByRole("article")).toHaveCount(3);
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  await page.getByRole("link", { name: /Back to selected work/ }).last().click();
  await expect(page.locator("#work")).toBeFocused();
  await expect(page.getByRole("link", { name: "PawFriend, Pet adoption case study" })).toBeInViewport();
  expect(errors).toEqual([]);
});

test("without JavaScript, the complete sequence and native skip link remain usable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  const articles = sequence.getByRole("article");
  await expect(articles).toHaveCount(3);
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  await sequence.getByRole("link", { name: "Skip to build notes" }).focus();
    await page.keyboard.press("Enter");
  await expect(page.locator("#pawfriend-implementation")).toBeFocused();
  await expect(page.locator("#pawfriend-implementation")).toBeInViewport();
  await context.close();
});

test("touch visitors scroll the stacked sequence normally and open build notes with one tap", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/work/pawfriend");
  const sequence = page.getByRole("region", { name: "From browsing to a first visit" });
  await sequence.getByRole("article").first().getByRole("heading").scrollIntoViewIfNeeded();
  const y = await page.evaluate(() => window.scrollY);
  const session = await context.newCDPSession(page);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 180, y: 600 }] });
  for (let position = 580; position >= 400; position -= 20) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 180, y: position }] });
    await page.waitForTimeout(20);
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(y + 50);
  await expect(sequence.getByRole("progressbar")).toBeHidden();
  await page.locator("#pawfriend-implementation").tap();
  await expect(page.locator("#pawfriend-implementation").locator("..")).toHaveAttribute("open", "");
  await context.close();
});
