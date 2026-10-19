import { expect, test } from "@playwright/test";

test("professional information leads and removed About actions stay absent", async ({ page }) => {
  await page.goto("/about");
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "A little about me", exact: true })).toHaveCount(0);
  await expect(main.getByRole("link", { name: "View selected work", exact: true })).toHaveCount(0);
  for (const name of ["Experience", "What I do", "Learning by building"]) {
    const professional = await main.getByRole("heading", { name, exact: true }).boundingBox();
    const trivia = await main.getByRole("heading", { name: "Little trivia", exact: true }).boundingBox();
    expect(professional!.y).toBeLessThan(trivia!.y);
  }
  await expect(main.getByRole("heading", { name: "Work I've done", exact: true })).toHaveCount(0);
  const headings = await main.getByRole("heading", { level: 2 }).allTextContents();
  expect(headings.slice(0, 2)).toEqual(["What I do", "Experience"]);
  await expect(main.locator('a[href^="/work/"]')).toHaveCount(0);
  await expect(main.getByRole("group", { name: "Button motion comparison" })).toBeVisible();
  await expect(main.getByRole("region", { name: "Experience" }).getByRole("link", { name: "Download resume, PDF" })).toHaveAttribute("download", "Alan-Sahlan-Resume.pdf");
});

test("the exact cobalt remains the same through both themes and page navigation", async ({ page }) => {
  await page.goto("/about");
  const toggle = page.locator(".site-header").getByRole("switch", { name: "Dark theme" });
  const cobalt = () => page.locator("html").evaluate(node => getComputedStyle(node).getPropertyValue("--cobalt").trim());
  expect(await cobalt()).toBe("#245bff");
  await toggle.click();
  expect(await cobalt()).toBe("#245bff");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await cobalt()).toBe("#245bff");
  await expect(page.getByRole("button", { name: "Open email draft" }).locator("[data-control-visual]")).toHaveCSS("background-color", "rgb(36, 91, 255)");
});

for (const width of [320, 390, 1440]) {
  test(`theme switch sits immediately left of Menu and Close at ${width}px, including enlarged text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/about");
    for (const size of [100, 200]) {
      await page.addStyleTag({ content: `html { font-size: ${size}%; }` });
      await page.evaluate(() => window.scrollTo(0, 250));
      const menu = page.getByRole("button", { name: "Open menu" });
      const compactToggle = page.locator(".compact-theme-control").getByRole("switch", { name: "Dark theme" });
      await expect(menu).toBeVisible();
      await expect(menu).toHaveCSS("transform", "none");
      const switchBox = await compactToggle.boundingBox(), menuBox = await menu.boundingBox();
      expect(menuBox!.x - switchBox!.x - switchBox!.width).toBeCloseTo(12 * size / 100, 0);
      expect(switchBox!.y + switchBox!.height / 2).toBeCloseTo(menuBox!.y + menuBox!.height / 2, 0);
      await compactToggle.focus();
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(compactToggle).toBeFocused();
      await expect(menu).toBeVisible();
      await page.keyboard.press("Tab");
      await expect(menu).toBeFocused();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog", { name: "Navigation menu" });
      const close = dialog.getByRole("button", { name: "Close menu" });
      const dialogToggle = dialog.getByRole("switch", { name: "Dark theme" });
      const toggleBox = await dialogToggle.boundingBox(), closeBox = await close.boundingBox();
      expect(closeBox!.x - toggleBox!.x - toggleBox!.width).toBeCloseTo(12 * size / 100, 0);
      expect(toggleBox!.y + toggleBox!.height / 2).toBeCloseTo(closeBox!.y + closeBox!.height / 2, 0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.keyboard.press("Shift+Tab");
      await expect(dialogToggle).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await page.getByRole("heading", { level: 1 }).focus();
    }
  });
}
