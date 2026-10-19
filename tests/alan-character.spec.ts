import { expect, test } from "@playwright/test";

const characterName = "Say hello to Alan";

test("Alan replaces the homepage portrait and keeps its dimensions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  await expect(character).toHaveAttribute("data-input", "pointer");
  await expect(character).toHaveAttribute("data-greeting", "false");
  await expect(page.locator('.hero-portrait img[src*="alan-portrait"]')).toHaveCount(0);
  await expect(character.getByRole("img", { name: "Alan Sahlan" })).toBeVisible();
  // Measure the resting layout after the entrance transform has finished.
  await character.evaluate(async node => {
    await Promise.all(node.getAnimations().map(animation => animation.finished));
  });
  await expect.poll(() => character.evaluate((node) => Math.round(node.getBoundingClientRect().height))).toBe(600);
  const bounds = await character.boundingBox();
  expect(bounds!.width).toBe(480);
  const location = await page.getByText("Based in Indonesia", { exact: true }).locator("..").boundingBox();
  expect(location!.x).toBeCloseTo(bounds!.x, 0);
  expect(location!.y + location!.height).toBeLessThan(bounds!.y);
});

test("head uses eight distinct facing views and returns forward at the face or window exit", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  await expect(character).toHaveAttribute("data-input", "pointer");
  const views = character.locator("[data-head-view]");
  await expect(character).toHaveAttribute("data-head-ready", "true");
  await expect(character).toHaveAttribute("data-greeting-head-ready", "true");
  await expect(views).toHaveCount(9);
  await expect.poll(() => views.locator("img").evaluateAll((images) => images.every((node) => node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0))).toBe(true);
  await expect.poll(() => character.evaluate((node) => node.getAnimations().every((animation) => animation.playState !== "running"))).toBe(true);
  const bounds = (await character.boundingBox())!;
  const center = { x: bounds.x + bounds.width * .5, y: bounds.y + bounds.height * .26 };
  const directions = [
    ["top", 0, -200], ["top-right", 150, -150], ["right", 200, 0], ["bottom-right", 150, 150],
    ["bottom", 0, 200], ["bottom-left", -150, 150], ["left", -200, 0], ["top-left", -150, -150],
  ] as const;
  for (const [direction, x, y] of directions) {
    await page.mouse.move(center.x + x, center.y + y);
    const view = character.locator(`[data-head-view="${direction}"]`);
    await expect(view).toHaveAttribute("data-active", "true");
    await expect(view).toHaveCSS("opacity", "1");
    await expect(view.locator('[data-head-expression="rest"]')).toHaveAttribute("src", new RegExp(`alan-head-${direction}\\.png`));
    await expect(view).toHaveCSS("transform", "none");
  }
  await page.mouse.move(center.x, center.y);
  await expect(character.locator('[data-head-view="front"]')).toHaveAttribute("data-active", "true");
  await page.mouse.move(center.x - 200, center.y);
  await expect(character.locator('[data-head-view="left"]')).toHaveAttribute("data-active", "true");
  await page.mouse.move(-10, -10);
  await expect(character.locator('[data-head-view="front"]')).toHaveAttribute("data-active", "true");
});

test("small pointer changes near a direction boundary do not flicker the head", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  await expect(character).toHaveAttribute("data-head-ready", "true");
  await expect.poll(() => character.evaluate((node) => node.getAnimations().every((animation) => animation.playState !== "running"))).toBe(true);
  const bounds = (await character.boundingBox())!;
  const center = { x: bounds.x + bounds.width * .5, y: bounds.y + bounds.height * .26 };
  await page.mouse.move(center.x + 150, center.y);
  await expect(character.locator('[data-head-view="right"]')).toHaveAttribute("data-active", "true");
  for (const angle of [21, 24, 22, 25]) {
    await page.mouse.move(center.x + Math.cos(angle * Math.PI / 180) * 150, center.y + Math.sin(angle * Math.PI / 180) * 150);
    await expect(character.locator('[data-head-view="right"]')).toHaveAttribute("data-active", "true");
  }
  await page.mouse.move(center.x + 106, center.y + 106);
  await expect(character.locator('[data-head-view="bottom-right"]')).toHaveAttribute("data-active", "true");
});

test("hover raises the wave arm smoothly, reveals the greeting, and can reverse", async ({ page }) => {
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  const wave = character.locator('[data-character-part="wave-arm"]');
  await character.hover();
  await expect(character).toHaveAttribute("data-greeting", "true");
  await expect(character.getByRole("status")).toHaveText("Hi! Nice to meet you!");
  await expect(wave).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await expect(wave).toHaveCSS("opacity", "1");
  await expect(character.locator('[data-character-part="greeting-body"]')).toHaveCSS("opacity", "1");
  await expect(character.locator('[data-character-part="rest-body"]')).toHaveCSS("opacity", "0");
  await expect(character.locator('[data-head-view][data-active="true"] [data-head-expression="greeting"]')).toHaveCSS("opacity", "1");
  await expect(character.locator('[data-head-view][data-active="true"] [data-head-expression="rest"]')).toHaveCSS("opacity", "0");
  await page.mouse.move(0, 0);
  await expect(character).toHaveAttribute("data-greeting", "false");
  await expect(character.getByRole("status")).toBeEmpty();
  await expect(wave).toHaveCSS("opacity", "0");
  await expect(character.locator('[data-character-part="rest-body"]')).toHaveCSS("opacity", "1");
  await expect(character.locator('[data-character-part="greeting-body"]')).toHaveCSS("opacity", "0");
  await character.hover();
  await page.mouse.move(0, 0);
  await character.hover();
  await expect(wave).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
});

test("the cheerful greeting expression follows all eight head directions", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  await expect(character).toHaveAttribute("data-greeting-head-ready", "true");
  await character.hover();
  const bounds = (await character.boundingBox())!;
  const center = { x: bounds.x + bounds.width * .5, y: bounds.y + bounds.height * .26 };
  const directions = [
    ["top", 0, -110], ["top-right", 90, -90], ["right", 110, 0], ["bottom-right", 90, 90],
    ["bottom", 0, 110], ["bottom-left", -90, 90], ["left", -110, 0], ["top-left", -90, -90],
  ] as const;
  for (const [direction, x, y] of directions) {
    await page.mouse.move(center.x + x, center.y + y);
    await expect(character).toHaveAttribute("data-greeting", "true");
    const head = character.locator(`[data-head-view="${direction}"]`);
    await expect(head).toHaveAttribute("data-active", "true");
    const face = head.locator('[data-head-expression="greeting"]');
    await expect(face).toHaveCSS("opacity", "1");
    await expect(face).toHaveAttribute("src", new RegExp(`alan-head-${direction}-greeting`));
    expect(await face.evaluate((node) => node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0)).toBe(true);
  }
});

test("the greeting stays visible while its directional expression images load", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route((url) => !!url.searchParams.get("url")?.match(/alan-head-.*-greeting\.png/), async (route) => { await pending; await route.continue(); });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const character = page.getByRole("button", { name: characterName });
  await expect(character).toHaveAttribute("data-head-ready", "true");
  await character.hover();
  await expect(character).toHaveAttribute("data-greeting", "true");
  await expect(character).toHaveAttribute("data-greeting-head-ready", "false");
  const bounds = (await character.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * .5 + 100, bounds.y + bounds.height * .26 + 100);
  await expect(character.locator('[data-head-view="front"]')).toHaveAttribute("data-active", "true");
  await expect(character.locator('[data-head-view="front"] [data-head-expression="greeting"]')).toHaveCSS("opacity", "1");
  await expect(character.getByRole("status")).toHaveText("Hi! Nice to meet you!");
  release();
  await expect(character).toHaveAttribute("data-greeting-head-ready", "true");
  await expect(character.locator('[data-head-view="bottom-right"]')).toHaveAttribute("data-active", "true");
});

test("keyboard greeting is immediate, stationary, and dismisses with Escape", async ({ page }) => {
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  await expect(character).toHaveAttribute("data-input", "pointer");
  await page.keyboard.press("Tab");
  await character.focus();
  await expect(character).toHaveAttribute("data-input", "keyboard");
  await expect(character).toHaveAttribute("data-greeting", "true");
  expect(await character.evaluate((node) => getComputedStyle(node).outlineWidth)).toBe("2px");
  const wave = character.locator('[data-character-part="wave-arm"]');
  await expect(wave).toHaveCSS("transition-duration", "0s");
  await expect(character.locator('[data-head-view="front"]')).toHaveAttribute("data-active", "true");
  await expect(character.locator('[data-head-view="front"]')).toHaveCSS("transition-duration", "0s");
  await page.keyboard.press("Escape");
  await expect(character).toHaveAttribute("data-greeting", "false");
  await expect(character).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(character).toHaveAttribute("data-greeting", "true");
});

test("touch can say hello and outside taps dismiss without false hover", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  await character.tap();
  await expect(character).toHaveAttribute("data-greeting", "true");
  await expect(character.getByRole("status")).toHaveText("Hi! Nice to meet you!");
  await expect(character.locator('[data-head-view="front"]')).toHaveAttribute("data-active", "true");
  await page.getByText("Based in Indonesia", { exact: true }).tap();
  await expect(character).toHaveAttribute("data-greeting", "false");
  await context.close();
});

test("reduced motion and forced colors keep the greeting without movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.goto("/");
  const character = page.getByRole("button", { name: characterName });
  await character.hover();
  await expect(character).toHaveAttribute("data-greeting", "true");
  await expect(character.getByRole("status")).toHaveText("Hi! Nice to meet you!");
  const wave = character.locator('[data-character-part="wave-arm"]');
  await expect(wave).toHaveCSS("transition-duration", "0s");
  await expect(wave).toHaveCSS("transform", "none");
  const head = character.locator('[data-head-view="front"]');
  await expect(head).toHaveAttribute("data-active", "true");
  await expect(head).toHaveCSS("transition-duration", "0s");
  await expect(head).toHaveCSS("transform", "none");
});
