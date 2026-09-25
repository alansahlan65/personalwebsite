import { expect, test } from "@playwright/test";

test("visitors read About and return to work or contact", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "More about me", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: "About me" })).toBeVisible();
  await expect(page.getByText(/My primary focus is Product Designer opportunities/)).toBeVisible();
  const navigation = page.getByRole("navigation", { name: "Primary" });
  await navigation.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeInViewport();
  await page.goto("/about");
  await navigation.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/#contact$/);
  await expect(page.getByRole("link", { name: "Let’s work together.", exact: true })).toHaveAttribute("href", "mailto:alansahlanwork@gmail.com");
});

test("confirmed contact and professional destinations are available on both pages", async ({ page }) => {
  for (const route of ["/", "/about"]) {
    await page.goto(route);
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "Let’s work together.", exact: true })).toHaveAttribute("href", "mailto:alansahlanwork@gmail.com");
    await expect(footer.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute("href", "https://www.linkedin.com/in/muhammadsahlanshadiq/");
    await expect(footer.getByRole("link", { name: "GitHub", exact: true })).toHaveAttribute("href", "https://github.com/alansahlan65");
    await expect(footer.getByRole("link", { name: "Behance", exact: true })).toHaveAttribute("href", "https://www.behance.net/muhammadsahlanshadiq");
    await expect(page.getByRole("link", { name: /Resume/ })).toHaveCount(0);
  }
});

test("keyboard navigation reaches About and restores access to home", async ({ page }) => {
  await page.goto("/about");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("link", { name: "Alan Sahlan, home" }).first().click();
  await expect(page).toHaveURL(/\/$/);
  const aboutLink = page.getByRole("link", { name: "More about me", exact: true });
  await aboutLink.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "About me", exact: true })).toBeFocused();
  await expect(page).toHaveTitle("About Alan Sahlan — Product Designer");
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1, name: "Alan Sahlan." })).toBeVisible();
});

for (const width of [320, 390, 650, 768, 1000, 1440]) {
  test(`About and contact fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: "About me", exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    if (width === 390) {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.addStyleTag({ content: "html { font-size: 200%; }" });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    const email = page.getByRole("link", { name: "alansahlanwork@gmail.com", exact: true });
    await email.focus();
    await expect(email).toBeFocused();
    await expect(email).toBeInViewport();
    expect(await email.evaluate(node => getComputedStyle(node).outlineStyle)).not.toBe("none");
  });
}

test("touch visitors open About with one tap", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await page.getByRole("link", { name: "More about me", exact: true }).tap();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { name: "About me", exact: true })).toBeVisible();
  await context.close();
});
