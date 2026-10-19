import { expect, test } from "@playwright/test";

test("touch loads only the front poses and still offers Alan's greeting", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const directional: string[] = [];
  page.on("request", request => { if (request.url().includes("alan-head-")) directional.push(request.url()); });
  await page.goto("/");
  const alan = page.getByRole("button", { name: "Say hello to Alan" });
  await expect(alan.locator("[data-head-view]")).toHaveCount(1);
  await alan.tap();
  await expect(alan).toHaveAttribute("data-greeting", "true");
  await expect(alan.getByRole("status")).toHaveText("Hi! Nice to meet you!");
  expect(directional).toEqual([]);
  await context.close();
});

test("changing motion preferences restores all eight directions without a loading deadlock", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const alan = page.getByRole("button", { name: "Say hello to Alan" });
  await expect(alan).toHaveAttribute("data-greeting-head-ready", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(alan.locator("[data-head-view]")).toHaveCount(1);
  await alan.hover();
  await expect(alan).toHaveAttribute("data-greeting", "true");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(alan).toHaveAttribute("data-head-ready", "true");
  await expect(alan).toHaveAttribute("data-greeting-head-ready", "true");
  const box = (await alan.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2 + 110, box.y + box.height * .26);
  await expect(alan.locator('[data-head-view="right"]')).toHaveAttribute("data-active", "true");
  await expect(alan.locator('[data-head-view="right"] [data-head-expression="greeting"]')).toHaveCSS("opacity", "1");
});

test("Alan remembers a pointer position that arrived while his head views were loading", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route(url => !!url.searchParams.get("url")?.match(/alan-head-(?!.*greeting).*\.png/), async route => { await pending; await route.continue(); });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const alan = page.getByRole("button", { name: "Say hello to Alan" });
  await expect(alan).toHaveAttribute("data-input", "pointer");
  await expect.poll(() => alan.evaluate(node => node.getAnimations().every(animation => animation.playState !== "running"))).toBe(true);
  const box = (await alan.boundingBox())!;
  await page.mouse.move(box.x - 30, box.y + box.height * .26);
  await expect(alan).toHaveAttribute("data-head-ready", "false");
  release();
  await expect(alan).toHaveAttribute("data-head-ready", "true");
  await expect(alan.locator('[data-head-view="left"]')).toHaveAttribute("data-active", "true");
});

test("a high-rate pointer burst measures its targets once and uses the final position", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  const about = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" });
  await about.hover();
  const reads = await page.evaluate(async () => {
    let reads = 0;
    const original = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = function () { reads++; return original.call(this); };
    const target = document.querySelector<HTMLAnchorElement>('.primary-nav a[href="/about"]')!;
    const box = original.call(target);
    for (let i = 0; i < 200; i++) target.dispatchEvent(new PointerEvent("pointermove", { bubbles: true, pointerType: "mouse", clientX: box.right - 4, clientY: box.top + box.height / 2 }));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    Element.prototype.getBoundingClientRect = original;
    return reads;
  });
  expect(reads).toBeLessThanOrEqual(5);
  const visual = about.locator("[data-magnet-part]");
  await expect.poll(() => visual.evaluate(node => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41)).toBeGreaterThan(0);
});

test("denied session storage preserves navigation, return links, and contact editing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    for (const name of ["getItem", "setItem", "removeItem"] as const) Storage.prototype[name] = () => { throw new DOMException("Storage denied", "SecurityError"); };
  });
  await page.goto("/");
  await page.getByRole("link", { name: /Aurelia, Hospitality case study/ }).click();
  await expect(page).toHaveURL(/\/work\/aurelia$/);
  await page.getByRole("link", { name: "Back to selected work" }).first().click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("heading", { name: "Selected work", exact: true })).toBeInViewport();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Menu", exact: true }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
  await page.getByLabel("Your name").fill("Alan");
  await page.getByLabel("Your message").fill("A note with storage unavailable.");
  await expect(page.getByLabel("Your message")).toHaveValue("A note with storage unavailable.");
  expect(errors).toEqual([]);
});

test("without Web Animations, links and browser history remain usable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(Element.prototype, "animate", { value: undefined, configurable: true }));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-pointer-enhancements-mounted", "true");
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/contact$/);
  expect(errors).toEqual([]);
});

test("missing ResizeObserver keeps case media stacked and readable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => {
    // Next's development overlay itself requires ResizeObserver. The shipped
    // application is also checked against next start, without that overlay.
    if (!error.stack?.includes("next-devtools")) errors.push(error.message);
  });
  await page.addInitScript(() => Object.defineProperty(window, "ResizeObserver", { value: undefined, configurable: true }));
  await page.goto("/work/pawfriend");
  await expect(page.locator(".case-media")).not.toHaveAttribute("data-horizontal", "true");
  await expect(page.locator(".case-media-panel")).toHaveCount(3);
  await page.locator(".case-media-panel").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".case-media-panel").last()).toBeInViewport();
  expect(errors).toEqual([]);
});

test("forced colors uses a stationary case-media reading layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/work/pawfriend");
  await expect(page.locator(".case-media")).toHaveAttribute("data-horizontal", "false");
  await page.locator(".case-media-panel").last().scrollIntoViewIfNeeded();
  await expect(page.locator(".case-media-track")).toHaveCSS("transform", "none");
  await page.goto("/");
  const instructions = page.getByRole("button", { name: "Show role instructions" });
  await instructions.hover();
  await expect(instructions.locator("span").first()).toHaveCSS("transform", "none");
  await page.getByRole("button", { name: /Product Designer. Show/ }).hover();
  const icons = page.locator('[class*="iconGroup"][data-active="true"] img');
  await expect(icons).toHaveCount(3);
  for (const icon of await icons.all()) await expect(icon).toHaveCSS("animation-name", "none");
});
