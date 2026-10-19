import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch();
const base = "http://127.0.0.1:3000";
const findings = [];

for (const device of [
  { name: "desktop", width: 1440, height: 900, hasTouch: false },
  { name: "mobile", width: 390, height: 844, hasTouch: true },
]) {
  for (const route of ["/", "/about", "/work/aurelia"]) {
    const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, hasTouch: device.hasTouch });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const slug = route === "/" ? "home" : route === "/about" ? "about" : "case";
    await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(140);
    await page.screenshot({ path: `.scratch/portfolio-motion/${slug}-${device.name}-moving.png` });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `.scratch/portfolio-motion/${slug}-${device.name}-settled.png` });

    if (route === "/") {
      await page.locator("#work .section-intro").getAttribute("data-page-motion");
      await page.locator("#work").scrollIntoViewIfNeeded();
      await page.waitForTimeout(110);
      await page.screenshot({ path: `.scratch/portfolio-motion/work-${device.name}-moving.png` });
      await page.waitForTimeout(450);
      await page.screenshot({ path: `.scratch/portfolio-motion/work-${device.name}-settled.png` });
    }

    findings.push({ route, device: device.name, errors, overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth) });
    await page.close();
  }
}

await writeFile(".scratch/portfolio-motion/inspection.json", JSON.stringify(findings, null, 2));
await browser.close();
