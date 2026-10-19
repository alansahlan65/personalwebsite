import { expect, test } from "@playwright/test";

test("arrow keys switch maps and Tab reaches only the selected map's full-size source", async ({ page, context }) => {
  await page.goto("/work/munchpal#munchpal-media-flow");
  const residents = page.getByRole("radio", { name: "Residents", exact: true });
  const volunteers = page.getByRole("radio", { name: "Volunteers", exact: true });
  await expect(residents).toBeChecked();
  await expect(page.getByRole("region", { name: "Volunteers user flow" })).toHaveCount(0);
  await residents.focus();
  const top = await residents.evaluate(element => element.getBoundingClientRect().top);
  await page.keyboard.press("ArrowRight");
  await expect(volunteers).toBeChecked();
  await expect(volunteers).toBeFocused();
  await expect(page.getByRole("region", { name: "Residents user flow" })).toHaveCount(0);
  expect(Math.abs(await residents.evaluate(element => element.getBoundingClientRect().top) - top)).toBeLessThan(2);
  await page.keyboard.press("Tab");
  const source = page.getByRole("link", { name: "Open Volunteer user-flow map at full size" });
  await expect(source).toBeFocused();
  const [imagePage] = await Promise.all([context.waitForEvent("page"), page.keyboard.press("Enter")]);
  await expect(imagePage).toHaveURL(/\/flow-volunteers\.png$/);
  await expect.poll(() => imagePage.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBe(3248);
  await imagePage.close();
  await volunteers.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(residents).toBeChecked();
  await expect(page.getByRole("region", { name: "Residents user flow" })).toBeVisible();
});

for (const width of [320, 390, 650, 768, 1000, 1440, 1920]) {
  test(`both complete maps fit with correct proportions and grid padding at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/work/munchpal#munchpal-media-flow");
    for (const [audience, dimensions] of [["Residents", [4544, 2410]], ["Volunteers", [3248, 1894]]] as const) {
      await page.getByRole("radio", { name: audience, exact: true }).check();
      const panel = page.getByRole("region", { name: `${audience} user flow` });
      const image = panel.getByRole("img");
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      const geometry = await image.evaluate((element: HTMLImageElement) => {
        const rect = element.getBoundingClientRect();
        return { width: element.naturalWidth, height: element.naturalHeight, ratio: rect.width / rect.height };
      });
      expect([geometry.width, geometry.height]).toEqual(dimensions);
      expect(geometry.ratio).toBeCloseTo(dimensions[0] / dimensions[1], 2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const padding = await page.locator("#munchpal-media-flow").evaluate(container =>
        Array.from(container.querySelectorAll("*")).filter(element => element.getBoundingClientRect().width > 0).flatMap(element => {
          const style = getComputedStyle(element);
          return [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(Number.parseFloat);
        }));
      padding.forEach(value => expect(value / 4).toBeCloseTo(Math.round(value / 4), 2));
    }
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    await page.getByRole("radio", { name: "Residents", exact: true }).check();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("touch visitors can switch back and forth in one tap", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work/munchpal#munchpal-media-flow");
  await page.getByRole("radio", { name: "Volunteers", exact: true }).tap();
  await expect(page.getByRole("region", { name: "Volunteers user flow" })).toBeVisible();
  await page.getByRole("radio", { name: "Residents", exact: true }).tap();
  await expect(page.getByRole("region", { name: "Residents user flow" })).toBeVisible();
  await context.close();
});

test("native switching works without JavaScript and print includes both original maps", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/work/munchpal#munchpal-media-flow");
  const volunteers = page.getByRole("radio", { name: "Volunteers", exact: true });
  await volunteers.check();
  await expect(page.getByRole("region", { name: "Volunteers user flow" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Residents user flow" })).toHaveCount(0);
  await page.emulateMedia({ media: "print" });
  await expect(page.getByRole("region", { name: "Residents user flow" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Volunteers user flow" })).toBeVisible();
  await context.close();
});

test("dark theme, RTL, reduced motion and forced colors retain selection and keyboard focus", async ({ page }) => {
  await page.goto("/work/munchpal");
  await page.getByRole("switch", { name: "Dark theme" }).click();
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  const residents = page.getByRole("radio", { name: "Residents", exact: true });
  await residents.focus();
  await page.keyboard.press("ArrowLeft");
  const volunteers = page.getByRole("radio", { name: "Volunteers", exact: true });
  await expect(volunteers).toBeChecked();
  await expect(volunteers).toBeFocused();
  await expect(page.getByRole("region", { name: "Volunteers user flow" })).toBeVisible();
  const outline = await volunteers.locator("..").evaluate(element => getComputedStyle(element).outlineStyle);
  expect(outline).toBe("solid");
});
