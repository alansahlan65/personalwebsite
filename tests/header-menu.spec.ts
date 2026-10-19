import { expect, test } from "@playwright/test";

for (const width of [320, 1920]) {
  test(`the selected menu row reaches both edges with clear contrast at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/contact");
    await page.evaluate(() => window.scrollTo(0, 180));
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(dialog).toHaveAttribute("data-phase", "open");
    const selected = dialog.getByRole("link", { name: "Contact", exact: true });
    await expect(selected).toHaveAttribute("aria-current", "page");
    const measurement = await selected.evaluate(element => {
      const box = element.getBoundingClientRect(), style = getComputedStyle(element);
      const panel = getComputedStyle(document.querySelector(".stairs-panel")!);
      function luminance(color: string) {
        const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(channel => {
          const value = channel / 255;
          return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
        });
        return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
      }
      const fill = luminance(style.backgroundColor), ink = luminance(style.color), surrounding = luminance(panel.backgroundColor);
      return {
        left: box.left, right: box.right, height: box.height, viewport: document.documentElement.clientWidth,
        pageWidth: document.documentElement.scrollWidth,
        textContrast: (Math.max(fill, ink) + .05) / (Math.min(fill, ink) + .05),
        selectionContrast: (Math.max(fill, surrounding) + .05) / (Math.min(fill, surrounding) + .05),
      };
    });
    expect(measurement.left).toBeCloseTo(0, 0);
    expect(measurement.right).toBeCloseTo(measurement.viewport, 0);
    expect(measurement.pageWidth).toBeLessThanOrEqual(width);
    expect(measurement.textContrast).toBeGreaterThanOrEqual(4.5);
    expect(measurement.selectionContrast).toBeGreaterThanOrEqual(3);
    await selected.hover();
    const hovered = await selected.evaluate(element => {
      const arrow = element.querySelector(".stairs-arrow")!, index = element.querySelector(".stairs-index")!;
      const window = element.querySelector(".stairs-marquee-window")!;
      return {
        fill: getComputedStyle(element).backgroundColor, arrowFill: getComputedStyle(arrow).backgroundColor,
        height: element.getBoundingClientRect().height,
        textLeft: window.getBoundingClientRect().left, textRight: window.getBoundingClientRect().right,
        indexRight: index.getBoundingClientRect().right, arrowLeft: arrow.getBoundingClientRect().left,
        clipping: getComputedStyle(window).overflow,
      };
    });
    expect(hovered.arrowFill).toBe(hovered.fill);
    expect(hovered.height).toBeCloseTo(measurement.height, 0);
    expect(hovered.textLeft).toBeGreaterThan(hovered.indexRight);
    expect(hovered.textRight).toBeLessThan(hovered.arrowLeft);
    expect(hovered.clipping).toBe("hidden");
  });
}

test("header changes at the scroll thresholds without shifting the page", async ({ page }) => {
  await page.goto("/");
  const full = page.getByRole("navigation", { name: "Primary" });
  const compact = page.locator(".compact-menu-trigger");
  await expect(full.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(compact).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeHidden();
  const heroTop = await page.locator(".hero").evaluate((node) => (node as HTMLElement).offsetTop);

  await page.evaluate(() => window.scrollTo(0, 110));
  await expect(compact).toBeVisible();
  await expect(full.getByRole("link", { name: "Home" })).toBeHidden();
  expect(await page.locator(".hero").evaluate((node) => (node as HTMLElement).offsetTop)).toBe(heroTop);

  await page.evaluate(() => window.scrollTo(0, 70));
  await expect(compact).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 40));
  await expect(full.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(compact).toBeHidden();
});

test("header keeps its focused link during scroll", async ({ page }) => {
  await page.goto("/");
  const home = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home" });
  await home.focus();
  await page.evaluate(() => window.scrollTo(0, 150));
  await expect(home).toBeFocused();
  await expect(home).toBeVisible();
  await home.blur();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});

test("Escape during opening restores focus and scroll, with no overlay left behind", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 360));
  const trigger = page.locator(".compact-menu-trigger");
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "About", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(360);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});

test("menu navigation works during opening and focuses the destination", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 240));
  await page.locator(".compact-menu-trigger").click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1, name: /Hi, I.m Alan/ })).toBeFocused();
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});


test("the dialog contains focus and keeps the page inert during resize", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 250));
  await page.locator(".compact-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  const close = dialog.getByRole("button", { name: "Close menu" });
  await expect(close).toBeFocused();
  expect(await page.getByRole("main", { includeHidden: true }).evaluate((element) => (element as HTMLElement).inert)).toBe(true);
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("switch", { name: "Dark theme" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: /Behance/ })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("switch", { name: "Dark theme" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(close).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await close.click();
  await expect(dialog).toHaveCount(0);
  expect(await page.getByRole("main").evaluate((element) => (element as HTMLElement).inert)).toBe(false);
});

test("rapid close and reopen follows the latest intent", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await dialog.getByRole("button", { name: "Reopen menu" }).click();
  await expect(dialog.getByRole("button", { name: "Close menu" })).toBeVisible();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toHaveCount(0);
});

test("same-page Home returns to the top and focuses the heading", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 230));
  await page.locator(".compact-menu-trigger").click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Home", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Alan Sahlan." })).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "page");
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});

test("reduced motion changes during opening leave a complete, immediate menu", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".compact-menu-trigger")).toBeFocused();
});

test("hover strips stop and static labels return on exit", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  const home = page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Home", exact: true });
  await home.hover();
  await expect(home.locator(".stairs-marquee")).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(home.locator(".stairs-marquee")).toBeHidden();
  await expect(home.locator(".stairs-static-label")).toBeVisible();
});



test("restored scroll and direct About loads choose the right header mode", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(page.locator(".compact-menu-trigger")).toBeVisible();
  await page.reload();
  await expect(page.locator(".compact-menu-trigger")).toBeVisible();
  await page.locator(".compact-menu-trigger").click();
  await expect(page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true })).toHaveAttribute("aria-current", "page");
});

test("modified menu clicks preserve a new tab and leave the current menu usable", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  const opened = context.waitForEvent("page");
  await dialog.getByRole("link", { name: "About", exact: true }).click({ modifiers: ["Control"] });
  const newPage = await opened;
  await expect(newPage).toHaveURL(/\/about$/);
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await expect(dialog).toHaveCount(0);
  await newPage.close();
});

test("menu navigation and Back leave no lock or overlay", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home" })).toBeVisible();
});

test("the menu fits at 320 pixels and has one focusable link per destination", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog.getByRole("link", { name: "Home", exact: true })).toHaveCount(1);
  await expect(dialog.getByRole("link", { name: "About", exact: true })).toHaveCount(1);
  await expect(dialog.getByRole("link", { name: "Contact", exact: true })).toHaveCount(1);
  await expect(dialog.getByRole("link", { name: "Download resume" })).toHaveAttribute("download", "Alan-Sahlan-Resume.pdf");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});


test("a focused compact trigger remains available when scrolling back to the top", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 250));
  const trigger = page.locator(".compact-menu-trigger");
  await expect(trigger).toBeVisible();
  await trigger.focus();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(trigger).toBeFocused();
  await expect(trigger).toBeVisible();
  await trigger.blur();
  await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home" })).toBeVisible();
});

test("repeating strips stop as soon as the menu starts closing", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  const home = page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Home", exact: true });
  await home.hover();
  await expect(home.locator(".stairs-marquee")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(home.locator(".stairs-marquee")).toBeHidden();
});


test("changing motion preference while a menu link is focused keeps that focus", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  const about = page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true });
  await about.focus();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(about).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Navigation menu" })).toHaveCount(0);
});

test("keyboard menu activation is immediate and Escape returns focus without a closing animation", async ({ page }) => {
  await page.goto("/#work");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toHaveAttribute("data-phase", "open");
  await expect(dialog.getByRole("button", { name: "Close menu" })).toBeFocused();
  expect(await dialog.locator(".stairs-panel").evaluateAll(panels => panels.some(panel =>
    panel.getAnimations().some(animation => animation.playState === "running" && Number(animation.effect?.getTiming().duration) > 0),
  ))).toBe(false);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});

test("same-page header Home returns to the top without duplicating history", async ({ page }) => {
  await page.goto("/");
  const home = page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Home", exact: true });
  await home.focus();
  await page.evaluate(() => window.scrollTo(0, 320));
  await expect(home).toBeVisible();
  const entries = await page.evaluate(() => history.length);
  await home.click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Alan Sahlan." })).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  expect(await page.evaluate(() => history.length)).toBe(entries);
  await expect(page.locator(".compact-menu-trigger")).toBeHidden();
});

test("menu dismissal follows the actual panel completion when playback slows", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 160));
  await page.locator(".compact-menu-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect.poll(() => dialog.locator(".stairs-panel").evaluateAll((panels) =>
    panels.every((panel) => Math.abs(panel.getBoundingClientRect().top) <= 1)
  )).toBe(true);
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await expect.poll(() => dialog.locator(".stairs-panel").evaluateAll((panels) =>
    panels.reduce((count, panel) => count + panel.getAnimations().length, 0)
  )).toBe(5);
  await dialog.locator(".stairs-panel").evaluateAll((panels) => {
    panels.forEach((panel) => panel.getAnimations().forEach((animation) => animation.updatePlaybackRate(0.1)));
  });
  await page.waitForTimeout(700);
  await expect(dialog).toBeVisible();
  const panels = dialog.locator(".stairs-panel");
  await panels.evaluateAll((elements) => {
    elements.slice(1).forEach((panel) => panel.getAnimations().forEach((animation) => animation.finish()));
  });
  await expect(dialog).toBeVisible();
  await panels.first().evaluate((panel) => panel.getAnimations().forEach((animation) => animation.finish()));
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".compact-menu-trigger")).toBeFocused();
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
});

