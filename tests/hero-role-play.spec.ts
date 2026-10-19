import { expect, test } from "@playwright/test";

test("the roles cycle with three matching hover icons and return to the default", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");

  for (const [label, icon, lead, description, nextStatement] of [
    ["Product Designer", "role-feather", "I am a", "UI/UX Designer at CADIT, building a component library and UI mockups.", "I'm learning to be a Design Engineer."],
    ["Design Engineer", "role-monitor", "I'm learning to be a", "Aurelia is a concept I designed and built independently.", "I am an Interaction Designer."],
    ["Interaction Designer", "role-stars", "I am an", "This portfolio explores focus, feedback, and motion.", "I am a Product Designer."],
  ]) {
    const role = page.getByRole("button", { name: new RegExp(`^${label}\\.`) });
    await expect(role).toBeVisible();
    await expect(role.locator("../..")).toContainText(lead);
    await expect(role).toHaveAccessibleDescription(`Select the role to see what I do. ${description}`);
    const group = role.locator("..").locator('span[data-active="true"]').filter({ has: page.locator("img") });
    await role.hover();
    await expect(group).toHaveCSS("opacity", "1");
    await expect(group.locator("img")).toHaveCount(3);
    for (const image of await group.locator("img").all()) {
      await expect(image).toHaveAttribute("src", `/images/${icon}.svg`);
      await expect(image.locator("..")).toHaveCSS("opacity", "1");
    }
    await page.mouse.move(700, 40);
    await expect(group).toHaveCSS("opacity", "0");
    await role.click();
    await expect(page.getByRole("status").filter({ hasText: /Product Designer|Design Engineer|Interaction Designer/ })).toHaveText(nextStatement);
  }
  await expect(page.getByRole("button", { name: /^Product Designer\./ })).toBeVisible();
  expect(errors).toEqual([]);
});

test("each role's icons glide outward from a shared point in the text", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Show role instructions" }).click();
  for (const label of ["Product Designer", "Design Engineer", "Interaction Designer"]) {
    const role = page.getByRole("button", { name: new RegExp(`^${label}\\.`) });
    await page.mouse.move(700, 40);
    await expect(role.locator('[data-active="true"]')).toHaveCSS("transform", "none");
    const group = role.locator("..").locator('span[data-active="true"]').filter({ has: page.locator("img") });
    await expect.poll(() => group.evaluate((element) => Array.from(element.children).every((particle) =>
      !particle.getAnimations().some((animation) => animation instanceof CSSTransition && animation.transitionProperty === "transform"),
    ))).toBe(true);
    await role.hover();
    const centersAt = (progress: number) => group.evaluate((element, phase) => Array.from(element.children).map((particle) => {
      const entrance = particle.getAnimations().find((animation) => animation instanceof CSSTransition && animation.transitionProperty === "transform");
      if (!entrance) throw new Error("Missing icon entrance transition");
      entrance.pause();
      const timing = entrance.effect!.getTiming();
      entrance.currentTime = Number(timing.delay) + Number(timing.duration) * phase;
      const rect = particle.getBoundingClientRect();
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
    }), progress);
    const text = await role.locator('[data-active="true"]').boundingBox();
    expect(text).not.toBeNull();
    const start = await centersAt(0);
    for (const point of start) {
      expect(Math.abs(point.x - text!.x - text!.width / 2)).toBeLessThan(1);
      expect(Math.abs(point.y - text!.y - text!.height / 2)).toBeLessThan(1);
    }
    const middle = await centersAt(0.12);
    const end = await centersAt(1);
    middle.forEach((point, index) => {
      const traveled = Math.hypot(point.x - start[index].x, point.y - start[index].y);
      const total = Math.hypot(end[index].x - start[index].x, end[index].y - start[index].y);
      expect(traveled).toBeGreaterThan(3);
      expect(traveled).toBeLessThan(total);
    });
    await role.click();
  }
});

for (const width of [320, 1440]) {
  test(`randomized floating icons stay clear of the role text at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.getByRole("button", { name: "Show role instructions" }).click();
    for (const label of ["Product Designer", "Design Engineer", "Interaction Designer"]) {
      const role = page.getByRole("button", { name: new RegExp(`^${label}\\.`) });
      const group = role.locator("..").locator('span[data-active="true"]').filter({ has: page.locator("img") });
      await role.hover();
      await expect(group).toHaveCSS("opacity", "1");
      await page.waitForTimeout(600);
      const positions = () => group.evaluate((element) => Array.from(element.children).map((particle) => {
        const rect = particle.getBoundingClientRect();
        return { x: rect.x, y: rect.y };
      }));
      const firstPositions = await positions();
      await page.mouse.move(width - 10, 10);
      await expect(group).toHaveCSS("opacity", "0");
      await role.hover();
      await page.waitForTimeout(600);
      expect(await positions()).not.toEqual(firstPositions);

      for (const image of await group.locator("img").all()) {
        await expect(image).toHaveCSS("animation-play-state", "running");
        const rotationSeconds = await image.evaluate((element) => parseFloat(getComputedStyle(element).animationDuration));
        expect(rotationSeconds).toBeGreaterThan(30);
      }
      for (const phase of [0, 0.125, 0.35, 0.7, 0.875]) {
        await group.evaluate((element, progress) => {
          for (const animation of element.getAnimations({ subtree: true })) {
            if (animation instanceof CSSAnimation) {
              animation.currentTime = Number(animation.effect!.getTiming().duration) * progress;
            }
          }
        }, phase);
        const text = await role.locator('[data-active="true"]').boundingBox();
        expect(text).not.toBeNull();
        const lead = await role.locator("../..").locator(":scope > span").first().boundingBox();
        const description = await role.locator("../../..").locator("p").last().boundingBox();
        expect(lead).not.toBeNull();
        expect(description).not.toBeNull();
        for (const image of await group.locator("img").all()) {
          const icon = await image.boundingBox();
          expect(icon).not.toBeNull();
          for (const copy of [text!, lead!, description!]) {
            const overlaps = icon!.x < copy.x + copy.width && icon!.x + icon!.width > copy.x
              && icon!.y < copy.y + copy.height && icon!.y + icon!.height > copy.y;
            expect(overlaps).toBe(false);
          }
        }
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await role.click();
    }
  });
}

test("the blob looks toward the pointer and reveals the exact instruction on hover", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const blob = page.getByRole("button", { name: "Show role instructions" });
  const body = blob.locator(":scope > span");
  const hint = page.getByText("Select the role to see what I do.", { exact: true }).first();
  await expect(hint).not.toBeVisible();
  await blob.click();
  await expect(blob).toHaveAttribute("aria-expanded", "true");
  await blob.click();
  await page.mouse.move(700, 40);
  await expect(hint).not.toBeVisible();
  await page.mouse.move(1200, 200);
  await expect.poll(() => body.evaluate((element) => getComputedStyle(element).transform)).not.toBe("matrix(1, 0, 0, 1, 0, 0)");
  const firstDirection = await body.evaluate((element) => getComputedStyle(element).transform);
  await page.mouse.move(5, 850);
  await expect.poll(() => body.evaluate((element) => getComputedStyle(element).transform)).not.toBe(firstDirection);
  await blob.hover();
  await expect(hint).toBeVisible();
  await page.mouse.move(700, 40);
  await expect(hint).not.toBeVisible();
});

test("keyboard and reduced motion preserve role switching without pointer movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const blob = page.getByRole("button", { name: "Show role instructions" });
  await page.mouse.move(1200, 200);
  await expect(blob.locator(":scope > span")).toHaveCSS("transform", "none");
  const role = page.getByRole("button", { name: /^Product Designer\./ });
  await role.focus();
  await expect(role).toBeFocused();
  await expect(page.getByText("Select the role to see what I do.", { exact: true }).first()).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: /^Design Engineer\./ })).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: /^Interaction Designer\./ })).toBeFocused();
});

test("touch visitors can open the hint and cycle roles at narrow widths", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 800 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Show role instructions" }).tap();
  await expect(page.getByText("Select the role to see what I do.", { exact: true }).first()).toBeVisible();
  for (const label of ["Product Designer", "Design Engineer", "Interaction Designer"]) {
    const role = page.getByRole("button", { name: new RegExp(`^${label}\\.`) });
    await expect(role).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await role.tap();
  }
  await context.close();
});

test("Escape dismisses the role hint without moving focus, including while hovered", async ({ page }) => {
  await page.goto("/");
  const blob = page.getByRole("button", { name: "Show role instructions" });
  const hint = page.getByText("Select the role to see what I do.", { exact: true }).first();
  await blob.focus();
  await page.keyboard.press("Enter");
  await expect(blob).toHaveAttribute("aria-expanded", "true");
  await blob.hover();
  await page.keyboard.press("Escape");
  await expect(blob).toBeFocused();
  await expect(blob).toHaveAttribute("aria-expanded", "false");
  await expect(hint).toHaveCSS("opacity", "0");
  await expect(hint).toBeHidden();

  await page.keyboard.press("Enter");
  await expect(blob).toHaveAttribute("aria-expanded", "true");
  await expect(hint).toBeVisible();
  await page.keyboard.press("Escape");
  const role = page.getByRole("button", { name: /^Product Designer\./ });
  await role.focus();
  await expect(hint).toBeHidden();

  await page.getByRole("heading", { level: 1 }).focus();
  await role.focus();
  await expect(hint).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(role).toBeFocused();
  await expect(hint).toBeHidden();
});

test("closing a pinned hint stays closed on touch until explicitly reopened", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 800 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await page.goto("/");
    const blob = page.getByRole("button", { name: "Show role instructions" });
    const hint = page.getByText("Select the role to see what I do.", { exact: true }).first();
    await blob.tap();
    await expect(blob).toHaveAttribute("aria-expanded", "true");
    await expect(hint).toBeVisible();
    await blob.tap();
    await expect(blob).toHaveAttribute("aria-expanded", "false");
    await expect(hint).toBeHidden();
    await blob.tap();
    await expect(hint).toBeVisible();
  } finally {
    await context.close();
  }
});
