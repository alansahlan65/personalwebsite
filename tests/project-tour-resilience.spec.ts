import { expect, test } from "@playwright/test";

for (const slug of ["paylecta", "munchpal"]) {
  test(`${slug} keeps manual playback when viewport observation is unavailable`, async ({ page }) => {
    await page.addInitScript(() => { Object.defineProperty(window, "IntersectionObserver", { value: undefined, configurable: true }); });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`/work/${slug}`);
    const play = page.getByRole("button", { name: /Play .* product tour/, exact: true });
    await expect(play).toBeVisible();
    await play.click();
    await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => !video.paused)).toBe(true);
    expect(errors).toEqual([]);
  });

  test(`${slug} offers a source link after a video loading failure`, async ({ page }) => {
    await page.route(`**/demos/${slug}/${slug}-opener.mp4`, route => route.abort());
    await page.goto(`/work/${slug}`);
    await page.locator("video").scrollIntoViewIfNeeded();
    const fallback = page.getByRole("link", { name: "Open the product tour", exact: true });
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute("href", `/demos/${slug}/${slug}-opener.mp4`);
    await expect(page.getByRole("link", { name: "Back to selected work" }).last()).toBeVisible();
  });
}
