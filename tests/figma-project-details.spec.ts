import { expect, test } from "@playwright/test";

for (const slug of ["paylecta", "munchpal"] as const) {
  test(`${slug} integrates original screens into the story with native full-size access`, async ({ page, context }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`/work/${slug}`);
    const screens = page.getByRole("region", { name: slug === "paylecta" ? "One place to see the business" : "A request starts with a listing" });
    await expect(page.getByRole("link", { name: /^(Showcase|Case study)$/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /^(Showcase|Case study)$/i })).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("View full screen");
    await expect(page.locator('main a[href^="/images/figma/"] svg')).toHaveCount(0);
    for (const link of await page.locator('main a[href^="/images/figma/"]').all()) expect((await link.innerText()).trim()).toBe("");
    const images = page.locator("main img");
    for (const image of await images.all()) {
      const source = await image.getAttribute("src");
      if (source?.match(/\/flow-(residents|volunteers)\.png$/)) {
        expect(slug).toBe("munchpal");
      } else {
        expect(source).toMatch(new RegExp(`^/images/figma/${slug}/.+\\.(svg|webp)$`));
        if (slug === "munchpal") expect(source).toMatch(/\.svg$/);
      }
    }
    const imageLink = screens.getByRole("link").first();
    await imageLink.focus();
    const [source] = await Promise.all([context.waitForEvent("page"), page.keyboard.press("Enter")]);
    await source.waitForLoadState();
    await expect(source).toHaveURL(new RegExp(`/images/figma/${slug}/`));
    await expect(source.locator("svg").first()).toBeVisible();
    await source.close();
    await expect(page.locator(".case-facts > div")).toHaveCount(3);
    expect(await page.locator("main").innerText()).not.toMatch(/35%|50%|45%|score of 90|designed and built/i);
    if (slug === "munchpal") await expect(page.locator("#munchpal-evaluation")).toContainText("109 of 110 task attempts");
    expect(errors).toEqual([]);
  });

  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`${slug} keeps proportional, loaded images and readable content at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/work/${slug}`);
      await expect(page.getByRole("button", { name: /Play .* product tour/, exact: true })).toBeVisible();
      for (const details of await page.locator("main details").all()) {
        if (await details.getAttribute("open") === null) await details.locator("summary").click();
      }
      for (const image of await page.locator("main img:visible").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        const geometry = await image.evaluate((img: HTMLImageElement) => {
          const style = getComputedStyle(img);
          return { natural:img.naturalWidth/img.naturalHeight, display:parseFloat(style.width)/parseFloat(style.height) };
        });
        expect(Math.abs(geometry.natural-geometry.display)).toBeLessThan(.01);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.addStyleTag({content:"html { font-size: 200%; }"});
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }

  test(`${slug} retains the reading flow, original images and build notes without JavaScript`, async ({ browser }) => {
    const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const page = await context.newPage();
    await page.goto(`/work/${slug}`);
    await expect(page.getByRole("heading", { name: /^(Showcase|Case study)$/i })).toHaveCount(0);
    if (slug === "munchpal") {
      const summary = page.locator("main details summary").first();
      await summary.focus();
      await page.keyboard.press("Enter");
      await expect(summary.locator("..")).toHaveAttribute("open", "");
    } else {
      await page.locator("#paylecta-implementation").scrollIntoViewIfNeeded();
      await expect(page.locator("#paylecta-implementation h2")).toBeVisible();
    }
    const links = page.getByRole("region", { name: slug === "paylecta" ? "One place to see the business" : "A request starts with a listing" }).getByRole("link");
    await links.last().focus();
    await expect(links.last()).toBeInViewport();
    await page.getByRole("link", { name: "Back to selected work" }).last().click();
    await expect(page).toHaveURL(/\/#work$/);
    await context.close();
  });
}
