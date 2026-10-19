import { expect, test } from "@playwright/test";

test("the flow pill has a soft takeoff, stationary labels and a continuous reversal", async ({ page }) => {
  await page.goto("/work/munchpal#munchpal-media-flow");
  await expect(page.locator(".site-header .theme-toggle")).toBeEnabled();
  const result = await page.locator("#munchpal-media-flow fieldset").evaluate(async fieldset => {
    const theme = document.querySelector(".site-header .theme-switch-track")!;
    const indicator = fieldset.querySelector<HTMLElement>('[aria-hidden="true"]')!;
    const labels = indicator.firstElementChild!;
    const read = () => getComputedStyle(indicator);
    const themeStyle = getComputedStyle(theme, "::before");
    const configuration = { flowDuration: read().transitionDuration, themeDuration: themeStyle.transitionDuration, flowEase: read().transitionTimingFunction, labelEase: getComputedStyle(labels).transitionTimingFunction };
    const residents = fieldset.querySelector<HTMLInputElement>('input[value="residents"]')!;
    const volunteers = fieldset.querySelector<HTMLInputElement>('input[value="volunteers"]')!;
    volunteers.click();
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const active = () => indicator.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === "transform");
    const outward = active()!;
    const duration = outward.effect!.getTiming().duration;
    outward.pause();
    outward.currentTime = 20;
    const takeoff = new DOMMatrixReadOnly(read().transform).m41;
    outward.currentTime = 100;
    const labelSlide = labels.getAnimations()[0];
    labelSlide.pause();
    labelSlide.currentTime = 100;
    const middle = new DOMMatrixReadOnly(read().transform).m41;
    const labelOffset = new DOMMatrixReadOnly(getComputedStyle(labels).transform).m41;
    const width = Number.parseFloat(read().width);
    residents.click();
    read().getPropertyValue("transform");
    const reversal = active()!;
    reversal.pause();
    reversal.currentTime = 0;
    const reverseStart = new DOMMatrixReadOnly(read().transform).m41;
    reversal.finish();
    const end = new DOMMatrixReadOnly(read().transform).m41;
    return { ...configuration, duration, takeoff, middle, labelOffset, width, reverseStart, end, selected: residents.checked };
  });
  expect(result.flowDuration).toBe(result.themeDuration);
  expect(result.flowEase).toBe(result.labelEase);
  expect(result.takeoff).toBeLessThan(result.width * .1);
  expect(result.duration).toBe(250);
  expect(result.middle).toBeGreaterThan(0);
  expect(result.middle).toBeLessThan(result.width + 4);
  expect(result.middle + result.labelOffset).toBeCloseTo(0, 2);
  expect(result.reverseStart).toBeCloseTo(result.middle, 1);
  expect(result.end).toBe(0);
  expect(result.selected).toBe(true);
});

test("keyboard, reduced motion and forced colors settle the pill immediately", async ({ page }) => {
  await page.goto("/work/munchpal#munchpal-media-flow");
  const indicator = page.locator('#munchpal-media-flow fieldset > [aria-hidden="true"]');
  const residents = page.getByRole("radio", { name: "Residents", exact: true });
  const volunteers = page.getByRole("radio", { name: "Volunteers", exact: true });
  await residents.focus();
  await page.keyboard.press("ArrowRight");
  await expect(volunteers).toBeChecked();
  expect(await indicator.evaluate(element => getComputedStyle(element).transitionDuration)).toBe("0s");
  for (const media of [{ reducedMotion: "reduce" }, { reducedMotion: "no-preference", forcedColors: "active" }] as const) {
    await page.emulateMedia(media);
    await residents.check();
    await volunteers.check();
    const state = await indicator.evaluate(element => ({ duration: getComputedStyle(element).transitionDuration, running: element.getAnimations().length }));
    expect(state.duration).toBe("0s");
    expect(state.running).toBe(0);
  }
});

test("the selection direction adapts to RTL and narrow enlarged-text controls", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/munchpal#munchpal-media-flow");
  await page.evaluate(() => { document.documentElement.dir = "rtl"; });
  const volunteers = page.getByRole("radio", { name: "Volunteers", exact: true });
  await volunteers.check();
  const indicator = page.locator('#munchpal-media-flow fieldset > [aria-hidden="true"]');
  const horizontal = await indicator.evaluate(element => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { x: matrix.m41, y: matrix.m42 };
  });
  expect(horizontal.x).toBeLessThan(0);
  expect(horizontal.y).toBe(0);
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  const vertical = await indicator.evaluate(element => {
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
    return { x: matrix.m41, y: matrix.m42 };
  });
  expect(vertical.x).toBe(0);
  expect(vertical.y).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
