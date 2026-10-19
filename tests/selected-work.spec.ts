import { expect, test } from "@playwright/test";

test("each thumbnail grows using the same image and reveals a short project story below it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const compactRequests: string[] = [];
  page.on("request", request => {
    if (request.url().includes("-compact.webp")) compactRequests.push(request.url());
  });
  await page.goto("/");
  await page.mouse.move(0, 0);
  const rows = page.locator(".project-row");
  await expect(rows).toHaveCount(4);
  await expect(page.locator(".project-preview img")).toHaveCount(4);
  await page.goto("/#work");
  await expect.poll(() => page.locator(".project-cover").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  for (const row of await rows.all()) {
    await expect(row).toHaveAttribute("data-expanded", "false");
    await expect(row.locator(".project-description")).toBeHidden();
  }
  const expandedSources: string[] = [];
  for (const row of await rows.all()) {
    const frame = row.locator(".project-preview");
    const image = await row.locator(".project-cover").elementHandle();
    const source = await row.locator(".project-cover").getAttribute("src");
    const decodedSource = await image!.evaluate(element => (element as HTMLImageElement).currentSrc);
    const compactWidth = (await frame.boundingBox())!.width;
    expect((await frame.boundingBox())!.height).toBeCloseTo(compactWidth / 3, 0);
    await row.locator("h3").hover();
    await expect(row).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
    await expect.poll(() => frame.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(compactWidth * 1.7);
    await expect(row.locator(".project-preview img")).toHaveCount(1);
    expect(await image!.evaluate(element => element.isConnected)).toBe(true);
    await expect(row.locator(".project-cover")).toHaveAttribute("src", source!);
    expect(await image!.evaluate(element => (element as HTMLImageElement).currentSrc)).toBe(decodedSource);
    await expect(row.locator(".project-description")).toBeVisible();
    await expect.poll(async () => {
      const media = (await frame.boundingBox())!;
      const story = (await row.locator(".project-description").boundingBox())!;
      return story.y - (media.y + media.height);
    }).toBeGreaterThan(0);
    await expect.poll(async () => { const box = (await frame.boundingBox())!; return Math.abs(box.width / box.height - 3); }).toBeLessThan(.02);
    expandedSources.push(source ?? "");
    await page.mouse.move(0, 0);
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(0);
    await expect.poll(async () => Math.abs((await frame.evaluate(element => element.getBoundingClientRect().width)) - compactWidth)).toBeLessThan(2);
    await expect(row.locator(".project-description")).toBeHidden();
  }
  expect(new Set(expandedSources).size).toBe(4);
  expect(compactRequests).toEqual([]);
});

test("keyboard focus expands one project at a time and all arrows have real destinations", async ({ page }) => {
  await page.goto("/#work");
  await page.keyboard.press("Tab");
  const links = page.locator(".project-link");
  await expect(page.locator(".work-preview-note, .project-context")).toHaveCount(0);
  await links.first().focus();
  for (let index = 0; index < 4; index++) {
    const row = page.locator(".project-row").nth(index);
    await expect(links.nth(index)).toBeFocused();
    await expect(links.nth(index)).toHaveAccessibleDescription(await row.locator(".project-description").innerText());
    await expect(row).toHaveAttribute("data-expanded", "true");
    await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(1);
    await expect(links.nth(index)).toHaveCSS("outline-style", "solid");
    await expect(row.locator(".project-cover")).toHaveCSS("transition-duration", "0s");
    await expect(row.locator(".project-description")).toBeVisible();
    await expect.poll(() => row.locator(".project-preview").evaluate(element => getComputedStyle(element).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
    await expect(links.nth(index)).not.toHaveAttribute("target", "_blank");
    await page.keyboard.press("Tab");
  }
  await expect(page.locator('.project-row[data-expanded="true"]')).toHaveCount(0);
  await expect(links.nth(1)).toHaveAttribute("href", "/work/paylecta");
  await expect(links.nth(2)).toHaveAttribute("href", "/work/pawfriend");
  await expect(links.nth(3)).toHaveAttribute("href", "/work/munchpal");
  await expect(page.getByRole("link", { name: /More work on Behance/ })).toHaveAttribute("href", "https://www.behance.net/muhammadsahlanshadiq");
});

test("banner expansion visibly interpolates and reduced motion settles immediately", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#work");
  const row = page.locator(".project-row").first();
  await row.scrollIntoViewIfNeeded();
  const frame = row.locator(".project-preview");
  const compact = (await frame.boundingBox())!.width;
  const heading = (await row.locator("h3").boundingBox())!;
  // Observe before triggering the short, fast-starting expansion. Waiting for
  // a locator assertion first can miss the entire interpolated portion.
  await frame.evaluate(element => {
    const widths: number[] = [];
    const start = performance.now();
    (window as typeof window & { previewSamples: Promise<number[]> }).previewSamples = new Promise(resolve => {
      const sample = () => {
        widths.push(element.getBoundingClientRect().width);
        if (performance.now() - start < 1200) requestAnimationFrame(sample);
        else resolve(widths);
      };
      requestAnimationFrame(sample);
    });
  });
  await page.mouse.move(heading.x + 5, heading.y + 5);
  await expect(row).toHaveAttribute("data-expanded", "true");
  const samples = await page.evaluate(() => (window as typeof window & { previewSamples: Promise<number[]> }).previewSamples);
  const expanded = samples.at(-1)!;
  expect(expanded).toBeGreaterThan(compact * 1.7);
  expect(samples.some(width => width > compact + 20 && width < expanded - 20)).toBe(true);
  await page.mouse.move(0, 0);
  await expect.poll(async () => Math.abs((await frame.boundingBox())!.width - compact)).toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.mouse.move(heading.x + 5, heading.y + 5);
  await expect(row).toHaveAttribute("data-expanded", "true");
  await expect.poll(() => frame.evaluate(element => getComputedStyle(element).transform)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  await expect(row.locator(".project-cover")).toHaveCSS("transition-duration", "0s");
});

for (const width of [390, 1440]) {
  test(`touch visitors read project stories and open a case with one tap at ${width}px`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3000/#work");
    for (const row of await page.locator(".project-row").all()) {
      await expect(row.locator(".project-description")).toBeVisible();
      await expect(row.locator(".project-preview img")).toHaveCount(1);
    }
    await page.getByRole("link", { name: "Munchpal, Food sharing case study" }).tap();
    await expect(page).toHaveURL(/\/work\/munchpal$/);
    await context.close();
  });
}

test("project stories and native destinations survive without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/#work");
  await expect(page.locator(".project-description:visible")).toHaveCount(4);
  await page.getByRole("link", { name: "Paylecta, Finance case study" }).click();
  await expect(page).toHaveURL(/\/work\/paylecta$/);
  await context.close();
});
