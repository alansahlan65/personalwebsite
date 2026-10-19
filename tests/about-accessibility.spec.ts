import { expect, test } from "@playwright/test";
import { createRequire } from "node:module";

const resolve = createRequire(`${process.cwd()}/package.json`).resolve;

for (const theme of ["light", "dark"]) {
  test(`the About comparison and expanded trivia pass accessibility checks in ${theme}`, async ({ page }) => {
    await page.addInitScript(theme => localStorage.setItem("portfolio-theme-v1", theme), theme);
    await page.goto("/about");
    await expect(page.locator(".site-header").getByRole("switch")).toBeEnabled();
    await page.getByRole("button", { name: "Save a favorite" }).click();
    const reveal = page.getByRole("button", { name: "Reveal answer" });
    const answerId = await reveal.getAttribute("aria-controls");
    await reveal.click();
    const answer = page.locator(`[id="${answerId}"]`);
    await expect(answer.locator('[aria-hidden="true"]')).toHaveCSS("opacity", "0");
    await expect(answer.locator('[aria-hidden="false"]')).toHaveCSS("opacity", "1");
    await page.addScriptTag({ path: resolve("axe-core/axe.min.js") });
    const violations = await page.evaluate(async () => {
      const axe = (window as typeof window & { axe: { run: () => Promise<{ violations: { id: string; nodes: { target: string[] }[] }[] }> } }).axe;
      return (await axe.run()).violations.map(({ id, nodes }) => ({ id, targets: nodes.map(node => node.target) }));
    });
    expect(violations).toEqual([]);
    await page.emulateMedia({ forcedColors: "active" });
    await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Next question" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "My kind of game night?" })).toBeVisible();
  });
}

test("touch cards drag freely while the surrounding page keeps native scrolling", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/about");
  const card = page.locator("[data-front]");
  await expect(card).toHaveAttribute("data-draggable");
  await card.evaluate(node => node.scrollIntoView({ block: "center" }));
  const session = await context.newCDPSession(page);
  async function swipe(dx: number, dy: number) {
    const box = await card.boundingBox();
    const x = box!.x + box!.width / 2, y = box!.y + box!.height / 2;
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let i = 1; i <= 10; i++) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + dx * i / 10, y: y + dy * i / 10 }] });
    }
    const shift = await card.evaluate(node => new Promise<{ x: number; y: number }>(resolve => requestAnimationFrame(() => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      resolve({ x: Math.sign(matrix.m41), y: Math.sign(matrix.m42) });
    })));
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    return shift;
  }
  for (const [dx, dy] of [[-35, -65], [35, -65], [-35, 65], [35, 65]]) {
    expect(await swipe(dx, dy)).toEqual({ x: Math.sign(dx), y: Math.sign(dy) });
    await expect.poll(() => card.evaluate(node => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return Math.abs(matrix.m41) + Math.abs(matrix.m42);
    })).toBeLessThan(1);
  }
  await swipe(-130, 0);
  await expect(card.getByRole("heading")).toHaveText("My kind of game night?");
  await expect.poll(() => card.evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m41))).toBeLessThan(1);
  const scrollBefore = await page.evaluate(() => scrollY);
  await swipe(0, -120);
  await expect.poll(() => card.evaluate(node => Math.abs(new DOMMatrixReadOnly(getComputedStyle(node).transform).m42))).toBeLessThan(1);
  expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
  await expect(card.getByRole("heading")).toHaveText("My kind of game night?");
  const box = await card.boundingBox();
  const y = box!.y + box!.height / 2;
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 12, y }] });
  for (let i = 1; i <= 10; i++) await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 12, y: y - 120 * i / 10 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(scrollBefore + 30);
  await expect(card.getByRole("heading")).toHaveText("My kind of game night?");
  await context.close();
});
