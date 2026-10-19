import { chromium, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const directory = path.resolve(".scratch/website-review/harden/visual");
await fs.mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const samples = [];
try {
  for (const viewport of [
    { width: 1440, height: 1080 },
    { width: 768, height: 1000 },
    { width: 390, height: 844 },
    { width: 320, height: 800 },
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference", hasTouch: viewport.width < 650, isMobile: viewport.width < 650 });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    try {
      await page.goto("http://127.0.0.1:3000/");
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("#work .section-intro")).toHaveAttribute("data-scroll-reveal", /instant|pending/);
      await page.waitForTimeout(750);
      const visible = await page.locator("[data-scroll-reveal]").evaluateAll(elements => elements.filter(element => {
        const rect = element.getBoundingClientRect();
        return rect.top < innerHeight && rect.bottom > 0;
      }).map(element => ({ text: element.textContent?.trim().slice(0, 90), state: element.getAttribute("data-scroll-reveal"), opacity: getComputedStyle(element).opacity })));
      expect(visible.every(element => element.opacity === "1")).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      await page.screenshot({ path: path.join(directory, "home-" + viewport.width + ".png") });
      await page.getByRole("button", { name: /^Product Designer\./ }).focus();
      await page.keyboard.press("Enter");
      await page.keyboard.press("Enter");
      await expect(page.getByRole("status").filter({ hasText: "I am an" })).toHaveText("I am an Interaction Designer.");
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      if (viewport.width < 650) {
        await page.screenshot({ path: path.join(directory, "interaction-role-" + viewport.width + ".png") });
        await page.locator("#work").evaluate(element => element.scrollIntoView());
        await expect(page.locator(".project-link").first()).toHaveCSS("opacity", "1");
        await page.waitForTimeout(650);
        await page.screenshot({ path: path.join(directory, "work-" + viewport.width + ".png") });
      }
      samples.push({ viewport, visible, errors });
      expect(errors).toEqual([]);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
await fs.writeFile(path.join(directory, "evidence.json"), JSON.stringify(samples, null, 2) + "\n");
console.log("Four viewport checks passed; initial-content, role grammar, and phone work screenshots saved.");
