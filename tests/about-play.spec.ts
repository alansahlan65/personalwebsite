import { expect, test } from "@playwright/test";

test("skill explanations open with keyboard, pin on touch and dismiss", async ({ page }) => {
  await page.goto("/about");
  const research = page.getByRole("button", { name: "user research", exact: true });
  await research.focus();
  await expect(page.getByRole("tooltip")).toContainText("Understand the problem.");
  await page.keyboard.press("Escape");
  await expect(research).toHaveAttribute("aria-expanded", "false");
  await research.click();
  await expect(research).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("heading", { level: 1 }).click();
  await expect(research).toHaveAttribute("aria-expanded", "false");
});

test("greeting opens and closes without moving the portrait", async ({ page }) => {
  await page.goto("/about");
  const before = await page.locator(".about-portrait").boundingBox();
  await page.getByRole("button", { name: "Say hello", exact: true }).click();
  await expect(page.getByText("Hey! Thanks for stopping by.", { exact: true })).toBeVisible();
  const after = await page.locator(".about-portrait").boundingBox();
  expect(after!.height).toBeCloseTo(before!.height, 0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Say hello", exact: true })).toHaveAttribute("aria-expanded", "false");
});

test("the restored comparison precedes trivia and keeps save state across modes", async ({ page }) => {
  await page.goto("/about");
  const work = page.getByRole("group", { name: "Button motion comparison" });
  const trivia = page.getByRole("region", { name: "Little trivia", exact: true });
  expect((await work.boundingBox())!.y).toBeLessThan((await trivia.boundingBox())!.y);
  const save = work.getByRole("button", { name: "Save a favorite", exact: true });
  await save.focus();
  await page.keyboard.press("Enter");
  await expect(work.getByRole("button", { name: "Saved", exact: true })).toHaveAttribute("aria-pressed", "true");
  await work.getByRole("button", { name: "Static", exact: true }).click();
  await expect(work).toHaveAttribute("data-motion", "off");
  await expect(work.getByRole("button", { name: "Saved", exact: true })).toHaveAttribute("aria-pressed", "true");
  await work.getByRole("button", { name: "Motion", exact: true }).click();
  await expect(work).toHaveAttribute("data-motion", "on");
  await work.getByRole("button", { name: "Saved", exact: true }).click();
  await expect(save).toHaveAttribute("aria-pressed", "false");
});

for (const width of [320, 390, 768, 1440]) {
  test(`About details fit at ${width}px with enlarged text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    for (const name of ["user research", "wireframing", "prototyping"]) {
      await page.getByRole("button", { name, exact: true }).click();
      const box = await page.getByRole("tooltip").boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
    }
    await page.getByRole("button", { name: "Say hello", exact: true }).click();
    await page.getByRole("button", { name: "Reveal answer", exact: true }).click();
    await page.getByRole("button", { name: "Save a favorite", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("touch visitors can open and close explanations and the greeting", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/about");
  const prototype = page.getByRole("button", { name: "prototyping", exact: true });
  await prototype.tap();
  await expect(page.getByRole("tooltip")).toContainText("Try the interaction.");
  await prototype.tap();
  await expect(prototype).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("button", { name: "Say hello", exact: true }).tap();
  await expect(page.getByRole("button", { name: "Hello back!", exact: true })).toHaveAttribute("aria-expanded", "true");
  await context.close();
});
