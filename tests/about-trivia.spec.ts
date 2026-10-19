import { expect, test } from "@playwright/test";

test("the compact trivia keeps reveals and cycles without category tabs or arrows", async ({ page }) => {
  await page.goto("/about");
  const trivia = page.getByRole("group", { name: "Little trivia about Alan" });
  await expect(trivia.getByRole("button", { name: /Read .* story/ })).toHaveCount(0);
  await expect(trivia.getByRole("heading", { name: "Marvel or DC?" })).toBeVisible();
  await trivia.getByRole("button", { name: "Reveal answer" }).click();
  await expect(trivia.getByRole("button", { name: "Hide answer" })).toHaveAttribute("aria-expanded", "true");
  await trivia.getByRole("button", { name: "Next question" }).click();
  await expect(trivia.getByRole("heading", { name: "My kind of game night?" })).toBeVisible();
  await trivia.getByRole("button", { name: "Reveal answer" }).click();
  await expect(trivia.locator("[data-front] p").filter({ hasText: "The Witcher 3 and Red Dead Redemption 2." })).toBeVisible();
  await trivia.getByRole("button", { name: "Next question" }).click();
  await expect(trivia.getByRole("heading", { name: "What keeps me turning pages?" })).toBeVisible();
  await trivia.getByRole("button", { name: "Next question" }).click();
  await expect(trivia.getByRole("button", { name: "Hide answer" })).toHaveAttribute("aria-expanded", "true");
});

test("swiping advances the compact deck and resets its position", async ({ page }) => {
  await page.goto("/about");
  const title = page.getByRole("heading", { name: "Marvel or DC?" });
  await title.scrollIntoViewIfNeeded();
  const box = await title.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + 10);
  await page.mouse.down();
  await page.mouse.move(box!.x + box!.width / 2 - 140, box!.y + 10, { steps: 12 });
  await page.mouse.up();
  await expect(page.getByRole("heading", { name: "My kind of game night?" })).toBeVisible();
  await expect.poll(() => page.locator("[data-front]").evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m41))).toBeLessThan(1);
});

test("keyboard and live motion preferences keep focus stable and inactive cards inert", async ({ page }) => {
  await page.goto("/about");
  const next = page.getByRole("button", { name: "Next question" });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(next).toBeFocused();
  await expect(page.locator("[data-notebook]")).toHaveAttribute("data-still");
  await expect(page.getByRole("button", { name: "Reveal answer" })).toHaveCount(1);
  await page.getByRole("button", { name: "Reveal answer" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "Hide answer" })).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-front]")).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await next.click();
  await expect(page.locator("[data-notebook]")).not.toHaveAttribute("data-still");
});

for (const width of [320, 390, 768, 1440]) {
  test(`all trivia fits at ${width}px with 200% text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    for (let card = 0; card < 3; card++) {
      await page.getByRole("button", { name: "Reveal answer" }).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.getByRole("button", { name: "Next question" }).click();
    }
  });
}

test("professional information and small personal facts survive without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "Experience", exact: true })).toBeVisible();
  await expect(page.getByText("Both. I love Marvel and DC.", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("The Witcher 3 and Red Dead Redemption 2.", { exact: true }).last()).toBeVisible();
  await expect(page.getByRole("button", { name: "Next question" })).toBeHidden();
  await expect(page.locator('main a[href^="/work/"]')).toHaveCount(0);
  await context.close();
});

test("touch visitors have a single-tap alternative to swiping", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/about");
  await page.getByRole("button", { name: "Next question" }).tap();
  await expect(page.getByRole("heading", { name: "My kind of game night?" })).toBeVisible();
  await page.getByRole("button", { name: "Reveal answer" }).tap();
  await expect(page.getByRole("button", { name: "Hide answer" })).toHaveAttribute("aria-expanded", "true");
  await context.close();
});
