import { expect, test } from "@playwright/test";

const routes = ["/", "/about", "/contact", "/work/aurelia", "/work/paylecta", "/work/pawfriend", "/work/munchpal"];

test("an invalid route offers a working path back to selected work", async ({ page }) => {
  const response = await page.goto("/work/unknown-project");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found." })).toBeVisible();
  const recovery = page.getByRole("main").getByRole("link", { name: "View selected work" });
  await expect(recovery).toHaveAttribute("data-magnet", "text");
  await recovery.click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("heading", { name: "Selected work" })).toBeInViewport();
});

test("each direct route has a title, a social image, and a usable action inventory", async ({ page }) => {
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    const title = await page.title();
    expect(title, route).toMatch(/Alan Sahlan/);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description, route).toBeTruthy();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description!);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image, route).toMatch(/opengraph-image\.jpg/);
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute("content");
    expect(twitterImage, route).toBeTruthy();
    // File metadata can append a cache suffix; compare the asset and its bytes.
    expect(new URL(twitterImage!).pathname, route).toBe(new URL(image!).pathname);
    const imageAlt = await page.locator('meta[property="og:image:alt"]').getAttribute("content");
    expect(imageAlt, route).toBeTruthy();
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute("content", imageAlt!);
    if (route.startsWith("/work/")) expect(new URL(image!).pathname, route).toBe(`${route}/opengraph-image.jpg`);
    const imageResponse = await page.request.get(image!);
    expect(imageResponse.ok(), `${route} social image`).toBe(true);
    expect(imageResponse.headers()["content-type"]).toMatch(/image\/jpeg/);
    const twitterImageResponse = await page.request.get(twitterImage!);
    expect(twitterImageResponse.ok(), `${route} Twitter image`).toBe(true);
    expect((await twitterImageResponse.body()).equals(await imageResponse.body()), `${route} matching social assets`).toBe(true);
    const missing = await page.locator("[data-page-transition] a[href], [data-page-transition] button").evaluateAll((actions) => actions
      .filter((action) => !action.matches('[data-magnet], [data-pointer-feedback="local"]'))
      .map((action) => action.outerHTML.slice(0, 160)));
    expect(missing, route).toEqual([]);
  }
});

test("release downloads and mail action resolve without sending anything", async ({ page }) => {
  await page.goto("/");
  const resume = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Resume" });
  const href = await resume.getAttribute("href");
  expect(href).toBe("/resume/alan-sahlan-resume.pdf");
  const response = await page.request.get(href!);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toMatch(/application\/pdf/);
  await expect(page.getByRole("link", { name: "alansahlanwork@gmail.com" })).toHaveAttribute("href", "mailto:alansahlanwork@gmail.com");
});
