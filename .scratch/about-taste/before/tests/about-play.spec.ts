import { expect, test } from "@playwright/test";

test("process sketches open on hover, stay available on click, and dismiss with Escape", async ({ page }) => {
  await page.goto("/about");
  const word = page.getByRole("button", { name: "wireframing", exact: true });
  await word.hover();
  await expect(page.getByRole("tooltip")).toContainText("Make room for the idea.");
  await page.getByRole("tooltip").hover();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await word.click();
  await page.mouse.move(10, 300);
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await expect(word).toHaveAttribute("aria-expanded", "false");
  await word.click();
  await page.getByRole("heading", { name: "A little about me" }).click();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
});

test("keyboard visitors can discover sketches and use the greeting and experiment", async ({ page }) => {
  await page.goto("/about");
  const research = page.getByRole("button", { name: "user research", exact: true });
  await research.focus();
  await expect(page.getByRole("tooltip")).toContainText("Start with a question.");
  await page.keyboard.press("Escape");
  await expect(research).toBeFocused();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "wireframing", exact: true })).toBeFocused();
  await expect(page.getByRole("tooltip")).toContainText("Make room for the idea.");

  const hello = page.getByRole("button", { name: "Say hello", exact: true });
  await hello.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Thanks for stopping by!", { exact: false }).first()).toBeVisible();
  const helloBack = page.getByRole("button", { name: "Hello back!", exact: true });
  await expect(helloBack).toHaveAttribute("aria-expanded", "true");
  expect(await helloBack.evaluate(node => getComputedStyle(node).transform)).toBe("none");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Say hello", exact: true })).toBeFocused();

  const demo = page.getByRole("button", { name: "Give it a click", exact: true });
  await demo.focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "That feels better.", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await page.locator('[data-active] i').first().evaluate(node => getComputedStyle(node).animationName)).toBe("none");
  await page.keyboard.press("Space");
  await expect(demo).toHaveAttribute("aria-pressed", "false");
});

test("the code peek returns to the experiment without losing its state or moving the section", async ({ page }) => {
  await page.goto("/about");
  await page.getByRole("button", { name: "Give it a click", exact: true }).click();
  const section = page.locator('section[aria-labelledby="approach-title"]');
  const before = await section.boundingBox();
  await page.getByRole("button", { name: "Peek at the code" }).click();
  await expect(page.locator("pre")).toContainText("transform: scale(0.97)");
  await expect(page.getByRole("button", { name: "That feels better.", exact: true })).toBeHidden();
  const after = await section.boundingBox();
  expect(after?.height).toBeCloseTo(before!.height, 0);
  await page.getByRole("button", { name: "Try it" }).click();
  await expect(page.getByRole("button", { name: "That feels better.", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("touch visitors tap all details without depending on hover", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/about");
  await page.getByRole("button", { name: "prototyping", exact: true }).tap();
  await expect(page.getByRole("tooltip")).toContainText("Give it a little life.");
  await page.getByRole("button", { name: "prototyping", exact: true }).tap();
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.getByRole("button", { name: "Say hello", exact: true }).tap();
  await expect(page.getByRole("button", { name: "Hello back!", exact: true })).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("button", { name: "Give it a click", exact: true }).tap();
  await expect(page.getByRole("button", { name: "That feels better.", exact: true })).toHaveAttribute("aria-pressed", "true");
  await context.close();
});

for (const width of [320, 390, 768, 1440]) {
  test(`open details stay inside the page at ${width}px with enlarged text`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    for (const name of ["user research", "wireframing", "prototyping"]) {
      await page.getByRole("button", { name, exact: true }).click();
      const preview = await page.getByRole("tooltip").boundingBox();
      expect(preview!.x).toBeGreaterThanOrEqual(0);
      expect(preview!.x + preview!.width).toBeLessThanOrEqual(width);
      await page.keyboard.press("Escape");
    }
    await page.getByRole("button", { name: "Say hello", exact: true }).click();
    const portrait = await page.locator(".about-portrait .portrait-frame").boundingBox();
    const greeting = await page.locator('[data-greeting] [aria-controls]').evaluate(node => node.previousElementSibling!.getBoundingClientRect().toJSON());
    expect(greeting.top).toBeGreaterThanOrEqual(portrait!.y);
    expect(greeting.bottom).toBeLessThanOrEqual(portrait!.y + portrait!.height);
    await page.getByRole("button", { name: "Give it a click", exact: true }).click();
    const animations = await page.locator('[data-greeting] svg, [data-active] i').evaluateAll(nodes => nodes.map(node => getComputedStyle(node).animationName));
    expect(animations.every(name => name === "none")).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  });
}

test("About retains its reading content and destinations without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: "A little about me" })).toBeVisible();
  await expect(page.getByText(/My background is in/)).toContainText("user research, wireframing, and prototyping", { useInnerText: true });
  await expect(page.locator("main").getByRole("link", { name: "View selected work" })).toHaveAttribute("href", "/#work");
  await expect(page.locator("main").getByRole("link", { name: "Download resume, PDF", exact: true })).toHaveAttribute("href", "/resume/alan-sahlan-resume.pdf");
  await context.close();
});
