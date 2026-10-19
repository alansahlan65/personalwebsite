import { expect, test } from "@playwright/test";

test("press feedback keeps the native hit area fixed and resets when the window loses focus", async ({ page }) => {
  await page.goto("/about");
  const hello = page.getByRole("button", { name: "Say hello", exact: true });
  await hello.scrollIntoViewIfNeeded();
  const before = await hello.boundingBox();
  await page.mouse.move(before!.x + before!.width / 2, before!.y + before!.height / 2);
  await page.mouse.down();
  const paint = hello.locator("[data-control-visual]");
  await expect.poll(() => paint.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).a)).toBeLessThan(.985);
  const during = await hello.boundingBox();
  expect(during!.width).toBeCloseTo(before!.width, 2);
  expect(during!.x).toBeCloseTo(before!.x, 2);
  await page.evaluate(() => window.dispatchEvent(new Event("blur")));
  await expect.poll(() => paint.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).a)).toBe(1);
  await page.mouse.up();
  expect(await hello.locator("[tabindex], button, a").count()).toBe(0);
});

test("device preference changes reset painted controls during an interaction", async ({ page }) => {
  await page.goto("/about");
  const hello = page.getByRole("button", { name: "Say hello", exact: true });
  await hello.scrollIntoViewIfNeeded();
  const box = await hello.boundingBox();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(hello.locator("[data-control-visual]")).toHaveCSS("transform", "none");
  await page.mouse.up();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("[data-notebook]")).not.toHaveAttribute("data-still");
});

test("the sliding trivia answer fits its card at 200% text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/about");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const reveal = page.getByRole("button", { name: /^(Reveal answer|Hide answer)$/ });
  const card = page.locator("[data-front]");
  await reveal.click();
  await expect(reveal).toHaveAttribute("aria-expanded", "true");
  const answer = card.locator("p").filter({ hasText: "Both. I love Marvel and DC." });
  await expect.poll(async () => {
    const box = await answer.boundingBox();
    const frame = await card.boundingBox();
    return box!.x >= frame!.x && box!.x + box!.width <= frame!.x + frame!.width;
  }).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await reveal.focus();
  await page.keyboard.press("Enter");
  await expect(reveal).toHaveAttribute("aria-expanded", "false");
  await expect(reveal).toBeFocused();
});
