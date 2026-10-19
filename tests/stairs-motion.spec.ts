import { expect, test, type Locator } from "@playwright/test";

const COVER_SAMPLE_TIME = 180;
const REVEAL_SAMPLE_TIME = 110;

test.beforeEach(async ({ page }) => {
  // Hold the real menu and route animations at creation so protocol/CI scheduling
  // cannot miss their short reveal phase. Other tests cover live navigation.
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
      const animation = animate.call(this, keyframes, options);
      if (this.classList.contains("stairs-panel") || (typeof options === "object" && options.id?.startsWith("route-"))) animation.pause();
      return animation;
    };
  });
});

async function pauseAt(panels: Locator, elapsed: number) {
  await expect.poll(() => panels.evaluateAll(elements => elements.every(element => element.getAnimations().length > 0)), { intervals: [10, 20, 50] }).toBe(true);
  await panels.evaluateAll(async (elements, elapsed) => {
    elements.forEach(element => element.getAnimations().forEach(animation => {
      animation.pause();
      animation.currentTime = elapsed;
    }));
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  }, elapsed);
  return panels.evaluateAll(elements => elements.map(element => {
    const { left, top, right, bottom } = element.getBoundingClientRect();
    return { left, top, right, bottom };
  }));
}

test("page stairs ramp gently at both ends while Menu keeps its vertical motion", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  await page.locator(".compact-menu-trigger").click();
  const menu = page.getByRole("dialog", { name: "Navigation menu" });
  const menuBounds = await pauseAt(menu.locator(".stairs-panel"), 250);
  const menuHeights = menuBounds.map(({ bottom }) => Math.max(0, Math.min(900, bottom)));
  expect(menuHeights.every((height, index) => index === 0 || height < menuHeights[index - 1])).toBe(true);
  menuBounds.forEach(({ left }, index) => expect(left).toBeCloseTo(index * 1440 / 5));
  const navigation = menu.getByRole("link", { name: "About", exact: true }).click();
  const route = page.locator(".route-curtain");
  await expect(route).toHaveAttribute("data-phase", "covering");
  const panels = route.locator(".route-curtain-panel");
  const routeBounds = await pauseAt(panels, COVER_SAMPLE_TIME);
  for (let index = 0; index < 5; index++) {
    expect(routeBounds[index].top).toBeCloseTo(index * 900 / 5);
    if (index > 0) expect(routeBounds[index].right).toBeLessThan(routeBounds[index - 1].right);
  }
  const positions = await panels.first().evaluate(async element => {
    const animation = element.getAnimations()[0];
    const timing = animation.effect!.getTiming();
    const positions: number[] = [];
    for (const fraction of [0, .1, .2, .8, .9, 1]) {
      animation.currentTime = (timing.delay ?? 0) + Number(timing.duration) * fraction;
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      positions.push(element.getBoundingClientRect().left);
    }
    return positions;
  });
  expect(positions[1] - positions[0]).toBeLessThan(positions[2] - positions[1]);
  expect(positions[5] - positions[4]).toBeLessThan(positions[4] - positions[3]);
  await expect(page).toHaveURL(/\/#work$/);
  await expect(route.locator(".route-curtain-scrim")).toHaveCSS("pointer-events", "none");
  await route.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await expect(page.getByRole("heading", { level: 1, name: /Hi, I.m Alan/ })).toBeFocused();
  await expect(route).toHaveAttribute("data-phase", "revealing");
  await route.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await expect(route).toHaveAttribute("data-phase", "idle");
  await navigation;
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});

for (const width of [390, 1440]) {
  test(`page panels travel only on X and Back reverses both phases at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const navigation = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About", exact: true }).click();
    const route = page.locator(".route-curtain");
    await expect(route).toHaveAttribute("data-phase", "covering");
    const panels = route.locator(".route-curtain-panel");
    const forward = await pauseAt(panels, COVER_SAMPLE_TIME);
    forward.forEach(({ left, right, top }, index) => {
      expect(left).toBeLessThan(0);
      expect(right).toBeGreaterThan(0);
      expect(right).toBeLessThan(width + 16);
      expect(top).toBeCloseTo(index * 900 / 5);
      if (index > 0) expect(right).toBeLessThan(forward[index - 1].right);
    });
    await route.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await expect.poll(() => route.getAttribute("data-phase"), { intervals: [10, 20, 50] }).toBe("revealing");
    const covered = await pauseAt(panels, 0);
    const radii = await panels.evaluateAll(elements => elements.map(element => Number.parseFloat(getComputedStyle(element).borderTopLeftRadius)));
    covered.forEach(({ left, right }, index) => {
      expect(left + radii[index]).toBeLessThanOrEqual(0);
      expect(right - radii[index]).toBeGreaterThanOrEqual(width);
    });
    const forwardReveal = await pauseAt(panels, REVEAL_SAMPLE_TIME);
    forwardReveal.forEach(({ left, top }, index) => {
      expect(left).toBeGreaterThanOrEqual(-16);
      expect(left).toBeLessThan(width + 16);
      expect(top).toBeCloseTo(index * 900 / 5);
      if (index > 0) expect(left).toBeLessThan(forwardReveal[index - 1].left);
    });
    await route.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await expect(route).toHaveAttribute("data-phase", "idle");
    await navigation;
    const backNavigation = page.goBack();
    await expect(route).toHaveAttribute("data-phase", "covering");
    await expect(route).toHaveAttribute("data-direction", "back");
    const back = await pauseAt(panels, COVER_SAMPLE_TIME);
    back.forEach(({ left, right, top }, index) => {
      expect(left).toBeGreaterThanOrEqual(-16);
      expect(left).toBeLessThan(width + 16);
      expect(right).toBeGreaterThan(width);
      expect(top).toBeCloseTo(index * 900 / 5);
      if (index > 0) expect(left).toBeLessThan(back[index - 1].left);
    });
    await expect(page.getByRole("heading", { level: 1, name: /Hi, I.m Alan/ })).toBeVisible();
    await route.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await expect(page.getByRole("heading", { level: 1, name: /Alan/ })).toBeFocused();
    await expect.poll(() => route.getAttribute("data-phase"), { intervals: [10, 20, 50] }).toBe("revealing");
    const revealing = await pauseAt(panels, REVEAL_SAMPLE_TIME);
    revealing.forEach(({ left, top }, index) => {
      expect(left).toBeLessThan(0);
      expect(left).toBeGreaterThan(-width - 48);
      expect(top).toBeCloseTo(index * 900 / 5);
      if (index > 0) expect(left).toBeLessThan(revealing[index - 1].left);
    });
    await route.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await expect(route).toHaveAttribute("data-phase", "idle");
    await backNavigation;
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}
