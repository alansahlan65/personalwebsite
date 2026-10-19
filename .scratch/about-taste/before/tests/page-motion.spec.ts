import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents = [];
    Element.prototype.animate = function (...args: Parameters<Element["animate"]>) {
      const animation = original.apply(this, args);
      if (animation.id.startsWith("page-motion-")) {
        (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents.push(animation.id);
      }
      return animation;
    };
  });
});

test("the homepage opens as one composed moment and reveals the work list on entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero h1")).toHaveCSS("animation-name", "opening-copy");
  await expect(page.locator(".hero .portrait-frame")).toHaveCSS("animation-name", "opening-portrait");
  await expect(page.locator("#work .section-intro")).toHaveAttribute("data-scroll-reveal", "pending");
  await expect(page.locator("#work .section-intro")).toHaveCSS("opacity", "0");

  await page.locator("#work .section-intro").scrollIntoViewIfNeeded();
  await expect(page.locator("#work .section-intro")).toHaveCSS("opacity", "1");
  await expect(page.locator(".project-link").first()).toHaveCSS("opacity", "1");
  await expect(page.getByRole("link", { name: /Aurelia, Hospitality case study/ })).toBeVisible();
});

test("jumping to selected work keeps its link clear of the compact menu", async ({ page }) => {
  await page.goto("/");
  await page.locator("#work").evaluate((element) => element.scrollIntoView());
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveClass(/is-visible/);
  const positions = await page.evaluate(() => ({
    menuBottom: document.querySelector(".compact-menu-trigger")!.getBoundingClientRect().bottom,
    workLinkTop: document.querySelector(".work-all")!.getBoundingClientRect().top,
  }));
  expect(positions.workLinkTop).toBeGreaterThan(positions.menuBottom);
});

test("About and case-study reading sections enter without delaying their content", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator(".about-page h1")).toHaveCSS("animation-name", "opening-copy");
  await page.locator(".about-details section").nth(1).scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() =>
    (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents.length,
  )).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Where I'm heading" })).toBeVisible();

  await page.goto("/work/paylecta");
  await expect(page.locator(".case-lead")).toHaveCSS("animation-name", "opening-copy");
  await page.getByRole("heading", { name: "Inside the design" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Inside the design" })).toBeVisible();
});

test("reduced motion keeps the complete page still and readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero h1")).toHaveCSS("animation-name", "none");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: /Munchpal, Food sharing case study/ })).toBeVisible();
  expect(await page.evaluate(() => (window as typeof window & { pageMotionEvents: string[] }).pageMotionEvents)).toEqual([]);
});

test("turning on reduced motion cancels an in-progress section entrance", async ({ page }) => {
  await page.goto("/");
  const project = page.locator(".project-link").first();
  await expect(project).toHaveAttribute("data-scroll-reveal", "pending");
  await page.addStyleTag({ content: '[data-scroll-reveal="revealed"] { transition-duration: 2000ms !important; }' });
  await page.locator("#work").scrollIntoViewIfNeeded();
  await expect.poll(() => project.evaluate((element) =>
    element.getAnimations().filter((animation) => animation instanceof CSSTransition).length,
  )).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(project).toHaveCSS("opacity", "1");
  await expect(project).toHaveCSS("transform", "none");
  await expect(page.locator('[data-scroll-reveal="pending"]')).toHaveCount(0);
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "1");
  await expect(page.locator(".contact h2")).toHaveCSS("opacity", "1");
});

test("later content waits for scrolling, visibly fades upward, and never replays", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const project = page.locator(".project-link").first();
  await expect(project).toHaveAttribute("data-scroll-reveal", "pending");
  await page.waitForTimeout(650);
  await expect(project).toHaveCSS("opacity", "0");
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "0");
  await expect(page.locator(".contact h2")).toHaveCSS("opacity", "0");
  await page.mouse.wheel(0, 650);
  await expect.poll(() => project.evaluate(element => element.getAnimations().some(animation => animation instanceof CSSTransition)), { intervals: [10, 20, 50] }).toBe(true);
  const samples = await project.evaluate(element => {
    const animations = element.getAnimations().filter(animation => animation instanceof CSSTransition);
    animations.forEach(animation => animation.pause());
    const sample = (progress: number) => {
      animations.forEach(animation => {
        const timing = animation.effect!.getTiming();
        animation.currentTime = (timing.delay ?? 0) + Number(timing.duration) * progress;
      });
      const style = getComputedStyle(element);
      return { opacity: Number(style.opacity), y: new DOMMatrixReadOnly(style.transform).m42 };
    };
    const result = [sample(0), sample(0.2), sample(1)];
    animations.forEach(animation => animation.finish());
    return result;
  });
  expect(samples[0].opacity).toBe(0);
  expect(samples[0].y).toBeCloseTo(24);
  expect(samples[1].opacity).toBeGreaterThan(0);
  expect(samples[1].opacity).toBeLessThan(1);
  expect(samples[1].y).toBeGreaterThan(0);
  expect(samples[1].y).toBeLessThan(24);
  expect(samples[2].opacity).toBe(1);
  expect(samples[2].y).toBeCloseTo(0);
  await page.locator(".about-copy").evaluate(element => element.scrollIntoView({ block: "center" }));
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "1");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.wheel(0, 650);
  await expect(project).toHaveCSS("opacity", "1");
  expect(await project.evaluate(element => element.getAnimations().filter(animation => animation instanceof CSSTransition).length)).toBe(0);
});

test("the About and footer content reveal on a narrow touch viewport without overflow", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".about-copy")).toHaveAttribute("data-scroll-reveal", "pending");
  for (const selector of [".about-copy", ".contact h2", ".professional-links", ".footer-bottom"]) {
    const content = page.locator(selector);
    await content.evaluate(element => element.scrollIntoView({ block: "center" }));
    await expect(content).toHaveCSS("opacity", "1");
    await expect(content).toHaveCSS("transform", "none");
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  }
  await context.close();
});

test("keyboard focus and direct section links reveal their content immediately", async ({ page }) => {
  await page.goto("/");
  const project = page.locator(".project-link").first();
  await expect(project).toHaveCSS("opacity", "0");
  await project.focus();
  await expect(project).toHaveCSS("opacity", "1");
  await expect(project).toHaveCSS("transform", "none");
  await expect(project).toHaveCSS("transition-duration", "0s");
  await page.keyboard.press("End");
  await expect(page.locator(".contact h2")).toHaveCSS("opacity", "1");
  await expect(page.locator(".contact h2")).toHaveCSS("transform", "none");
  await page.goto("/#work");
  await expect(project).toHaveCSS("opacity", "1");
  await expect(project).toHaveCSS("transition-duration", "0s");
});

test("a pointer click during an About reveal follows the link without a focus jump", async ({ page }) => {
  await page.goto("/");
  await page.addStyleTag({ content: '[data-scroll-reveal="revealed"] { transition-duration: 2000ms !important; }' });
  const copy = page.locator(".about-copy");
  await expect(copy).toHaveAttribute("data-scroll-reveal", "pending");
  await copy.evaluate(element => element.scrollIntoView({ block: "center" }));
  await expect.poll(() => copy.evaluate(element => element.getAnimations().some(animation => animation instanceof CSSTransition)), { intervals: [10, 20, 50] }).toBe(true);
  await copy.evaluate(element => element.getAnimations().forEach(animation => {
    animation.pause();
    const timing = animation.effect!.getTiming();
    animation.currentTime = (timing.delay ?? 0) + Number(timing.duration) * 0.2;
  }));
  const link = page.getByRole("link", { name: "More about me" });
  const bounds = (await link.boundingBox())!;
  await page.mouse.click(bounds.x + 8, bounds.y + bounds.height / 2);
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: /I design digital products/ })).toBeFocused();
});

test("forced colors makes all pending content immediately readable", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "0");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "1");
  await expect(page.locator(".contact h2")).toHaveCSS("opacity", "1");
  await expect(page.locator('[data-scroll-reveal="pending"]')).toHaveCount(0);
});

test("missing viewport observation keeps all content readable", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(window, "IntersectionObserver", { value: undefined, configurable: true }));
  await page.goto("/");
  await expect(page.locator(".project-link").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".about-copy")).toHaveCSS("opacity", "1");
  await expect(page.locator(".contact h2")).toHaveCSS("opacity", "1");
  expect(errors).toEqual([]);
});

test("without JavaScript the homepage still contains readable work and contact links", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".project-link").first()).toHaveCSS("opacity", "1");
  await expect(page.locator(".contact h2")).toHaveCSS("opacity", "1");
  await expect(page.getByRole("link", { name: "alansahlanwork@gmail.com" })).toHaveAttribute("href", "mailto:alansahlanwork@gmail.com");
  await context.close();
});

for (const viewport of [{ width: 1440, height: 1080 }, { width: 768, height: 1000 }]) {
  test(`work already in the initial viewport is readable without scrolling at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const intro = page.locator("#work .section-intro");
    const project = page.locator(".project-link").first();
    await expect(intro).toHaveAttribute("data-scroll-reveal", "instant");
    await expect(project).toHaveAttribute("data-scroll-reveal", "instant");
    for (const content of [intro, project]) {
      await expect(content).toBeInViewport();
      await expect(content).toHaveCSS("opacity", "1");
      await expect(content).toHaveCSS("transform", "none");
    }
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
}
