import { expect, test } from "@playwright/test";

test("visitors recognize Alan and navigate the homepage immediately", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Alan Sahlan." })).toBeVisible();
  await expect(page.getByText("Design • Engineer", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Design / Build / Refine" })).toHaveCount(0);
  await expect(page.getByRole("img", { name: "Alan Sahlan", exact: true })).toBeVisible();
  await expect(page.getByText("Based in Indonesia", { exact: true })).toBeVisible();

  const navigation = page.getByRole("navigation", { name: "Primary" });
  await navigation.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(navigation.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

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
    const portraitBox = await page.locator(".hero-portrait .portrait-frame").boundingBox();
    const locationBox = await page.getByText("Based in Indonesia", { exact: true }).locator("..").boundingBox();
    expect(portraitBox).not.toBeNull();
    expect(locationBox).not.toBeNull();
    if (width <= 650) {
      expect(locationBox!.x + locationBox!.width).toBeLessThanOrEqual(portraitBox!.x);
      const shortcut = page.getByRole("link", { name: "Selected work", exact: true });
      await expect(shortcut).toBeVisible();
      await expect(shortcut).toHaveAttribute("href", "#work");
    } else {
      expect(Math.abs(locationBox!.x - portraitBox!.x)).toBeLessThan(1);
      expect(locationBox!.y + locationBox!.height).toBeLessThanOrEqual(portraitBox!.y);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);

    const navigation = page.getByRole("navigation", { name: "Primary" });
    await expect(navigation.getByRole("link")).toHaveCount(4);
    await expect(navigation.getByRole("link", { name: "Download resume, PDF", exact: true })).toHaveAttribute("download", "Alan-Sahlan-Resume.pdf");
    await navigation.getByRole("link", { name: "About", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: /I design digital products/ })).toBeInViewport();
    await navigation.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
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
