import { expect, test } from "@playwright/test";

test("four compact banners load, and each row opens its own distinct wide artwork", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  await page.mouse.move(0, 0);
  const rows = page.locator(".project-row");
  await expect(rows).toHaveCount(4);
  await expect(page.locator(".project-preview img")).toHaveCount(8);
  await expect.poll(() => page.locator(".project-preview img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  const sources = await page.locator(".project-preview img").evaluateAll(images => images.map(image => (image as HTMLImageElement).src));
  expect(new Set(sources).size).toBe(8);
  for (const row of await rows.all()) {
    await expect(row).toHaveAttribute("data-expanded", "false");
    await expect(row.locator(".project-banner-compact")).toHaveCSS("opacity", "1");
    await expect(row.locator(".project-banner-expanded")).toHaveCSS("opacity", "0");
  }
  for (const row of await rows.all()) {
    const frame = row.locator(".project-preview");
    const compactWidth = (await frame.boundingBox())!.width;
    await row.locator("h3").hover();
    await expect(row).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
    await expect.poll(() => frame.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(compactWidth * 1.7);
    await expect(row.locator(".project-banner-expanded")).toHaveCSS("opacity", "1");
    await page.mouse.move(0, 0);
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(0);
    await expect.poll(async () => Math.abs((await frame.evaluate(element => element.getBoundingClientRect().width)) - compactWidth)).toBeLessThan(2);
  }
});

test("keyboard focus expands one project at a time and all arrows have real destinations", async ({ page }) => {
  await page.goto("/#work");
  await page.keyboard.press("Tab");
  const links = page.locator(".project-link");
  await links.first().focus();
  for (let index = 0; index < 4; index++) {
    const row = page.locator(".project-row").nth(index);
    await expect(links.nth(index)).toBeFocused();
    await expect(row).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
    await expect(links.nth(index)).toHaveCSS("outline-style", "solid");
    await expect(links.nth(index)).not.toHaveAttribute("target", "_blank");
    await page.keyboard.press("Tab");
  }
  await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(0);
  await expect(links.nth(1)).toHaveAttribute("href", "/work/paylecta");
  await expect(links.nth(2)).toHaveAttribute("href", "/work/pawfriend");
  await expect(links.nth(3)).toHaveAttribute("href", "/work/munchpal");
  await expect(page.getByRole("link", { name: /View all work on Behance/ })).toHaveAttribute("href", "https://www.behance.net/muhammadsahlanshadiq");
});

test("banner expansion visibly interpolates and reduced motion settles immediately", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  const row = page.locator(".project-row").first();
  await row.scrollIntoViewIfNeeded();
  const frame = row.locator(".project-preview");
  const compact = (await frame.boundingBox())!.width;
  const heading = (await row.locator("h3").boundingBox())!;
  await page.mouse.move(heading.x + 5, heading.y + 5);
  await expect(row).toHaveAttribute("data-expanded", "true");
  const samples = await frame.evaluate(element => new Promise<number[]>(resolve => {
    const widths: number[] = [];
    const start = performance.now();
    const sample = () => {
      widths.push(element.getBoundingClientRect().width);
      if (performance.now() - start < 600) requestAnimationFrame(sample);
      else resolve(widths);
    };
    requestAnimationFrame(sample);
  }));
  const expanded = samples.at(-1)!;
  expect(expanded).toBeGreaterThan(compact * 1.7);
  expect(samples.some(width => width > compact + 20 && width < expanded - 20)).toBe(true);
  await page.mouse.move(0, 0);
  await expect.poll(async () => Math.abs((await frame.boundingBox())!.width - compact)).toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(heading.x + 5, heading.y + 5);
  await expect(row).toHaveAttribute("data-expanded", "true");
  await expect.poll(() => frame.evaluate(element => getComputedStyle(element).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  await expect(row.locator(".project-banner-expanded")).toHaveCSS("transition-duration", "0.08s");
});
