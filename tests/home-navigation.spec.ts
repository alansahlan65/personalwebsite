import { expect, test } from "@playwright/test";

for (const from of ["/about", "/contact", "/work/aurelia"]) {
  for (const viaMenu of [false, true]) {
    test(`Home returns to the page top from ${from} through ${viaMenu ? "Menu" : "the header"}`, async ({ page }) => {
      await page.goto(from);
      const primary = page.getByRole("navigation", { name: "Primary" });
      await expect(primary.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/");
      await expect(primary.getByRole("link", { name: "Work", exact: true })).toHaveCount(0);
      if (viaMenu) {
        await page.evaluate(() => window.scrollTo(0, 240));
        await page.getByRole("button", { name: "Open menu" }).click();
      }
      const navigation = viaMenu ? page.getByRole("dialog", { name: "Navigation menu" }) : primary;
      await navigation.getByRole("link", { name: "Home", exact: true }).click();
      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole("heading", { level: 1, name: "Alan Sahlan." })).toBeFocused();
      await expect(page.locator(".route-curtain")).toHaveAttribute("data-phase", "idle");
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await expect(primary.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
      await expect(page.getByRole("dialog", { name: "Navigation menu" })).toHaveCount(0);
      expect(await page.evaluate(() => document.body.style.position)).toBe("");
    });
  }
}

for (const route of ["/#work", "/?source=test#work"]) {
  test(`Home clears the selected-work hash from ${route} and returns to the top`, async ({ page }) => {
    await page.goto(route);
    await page.getByRole("button", { name: "Open menu" }).click();
    const home = page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Home", exact: true });
    await expect(home).toHaveAttribute("aria-current", "page");
    await expect(home.locator(".stairs-marquee")).toContainText("Homepage  //  ");
    await home.click();
    await expect(page).toHaveURL(/\/$/);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("heading", { level: 1, name: "Alan Sahlan." })).toBeFocused();
    await expect(page.getByRole("dialog", { name: "Navigation menu" })).toHaveCount(0);
  });
}
