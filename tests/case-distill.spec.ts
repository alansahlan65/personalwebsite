import { expect, test } from "@playwright/test";

for (const [slug, before] of [["pawfriend", 586]] as const) {
  test(`${slug} has a shorter default read and keeps original detail accessible`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/work/${slug}`);
    const words = (await page.locator("main").innerText()).trim().split(/\s+/).length;
    expect(words).toBeLessThan(before * .67);
    await expect(page.locator(".case-facts > div")).toHaveCount(3);
    await expect(page.locator(".case-decisions")).toHaveCount(0);
    const panel = page.locator(".case-media-panel").first();
    await expect(panel.getByRole("link")).toHaveCount(0);
    const summary = panel.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(panel.getByRole("link")).toHaveAttribute("href", /\/images\//);
    await page.keyboard.press("Space");
    await expect(panel.getByRole("link")).toHaveCount(0);
  });
}

test("Munchpal direct screen fragments work with and without JavaScript", async ({ browser }) => {
  for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ javaScriptEnabled, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto("/work/munchpal#munchpal-media-home");
    await expect(page.locator("#munchpal-media-home").getByRole("link")).toHaveAttribute("href", "/images/figma/munchpal/home.svg");
    await expect(page.locator("#munchpal-media-home")).toBeInViewport();
    await page.getByText("Test details", { exact: true }).click();
    await expect(page.getByRole("region", { name: "Resident tasks" })).toBeVisible();
    await expect(page.locator('dl[aria-labelledby="munchpal-results-caption"]')).toContainText("50 of 50");
    expect(errors).toEqual([]);
    await context.close();
  }
});
