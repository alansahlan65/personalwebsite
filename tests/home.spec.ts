import { expect, test } from "@playwright/test";

test("visitors recognize Alan and navigate the homepage immediately", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Alan Sahlan." })).toBeVisible();
  await expect(page.getByText("Design • Engineer", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: "Alan Sahlan", exact: true })).toBeVisible();
  await expect(page.getByText("Based in Indonesia", { exact: true })).toBeVisible();

  const navigation = page.getByRole("navigation", { name: "Primary" });
  await navigation.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("heading", { name: "Selected work", exact: true })).toBeInViewport();

  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

for (const width of [320, 390, 650, 768, 1000, 1440]) {
  test(`homepage remains readable and navigable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const title = page.getByRole("heading", { level: 1, name: "Alan Sahlan." });
    await expect(title).toBeVisible();
    const titleBox = await title.boundingBox();
    expect(titleBox).not.toBeNull();
    expect(titleBox!.x).toBeGreaterThanOrEqual(0);
    expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(width);

    const portrait = page.getByRole("img", { name: "Alan Sahlan", exact: true });
    await expect(portrait).toBeVisible();
    await expect.poll(() => portrait.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    const navigation = page.getByRole("navigation", { name: "Primary" });
    await expect(navigation.getByRole("link")).toHaveCount(3);
    await expect(navigation.getByText("Resume", { exact: true })).toHaveAttribute("aria-disabled", "true");
    await navigation.getByRole("link", { name: "About", exact: true }).click();
    await expect(page.getByRole("heading", { name: "About me", exact: true })).toBeInViewport();
    await navigation.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Let’s work together.", exact: true })).toBeInViewport();
  });
}

test("reduced motion and enlarged text preserve content and real destinations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  for (const link of await page.getByRole("link").all()) {
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).not.toBe("#");
    if (href?.startsWith("#")) await expect(page.locator(href)).toHaveCount(1);
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByRole("heading", { name: "Selected work", exact: true })).toBeVisible();
});
