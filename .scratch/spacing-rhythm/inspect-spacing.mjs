import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const phase = process.argv[2] ?? "before";
const baseURL = process.env.SPACING_BASE_URL ?? "http://127.0.0.1:3000";
const widths = phase === "stress" ? [320, 650, 768, 1000, 1920] : [390, 1440];
const routes = ["/", "/about", "/contact", "/work/aurelia", "/work/pawfriend", "/work/munchpal", "/work/paylecta", "/missing-page"];
const browser = await chromium.launch();
const results = [];
await mkdir(`.scratch/spacing-rhythm/${phase}`, { recursive: true });
try {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(`${baseURL}${route}`);
      await page.locator("main").waitFor();
      await page.evaluate(async () => {
        document.querySelectorAll("main details").forEach(details => { details.open = true; });
        await document.fonts.ready;
      });
      const measurement = await page.evaluate(() => {
        const visible = element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
        const offGridPadding = Array.from(document.querySelectorAll("main, main *, header, header *, footer, footer *")).filter(visible).flatMap(element => {
          const style = getComputedStyle(element);
          const values = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"].map(property => parseFloat(style[property]));
          return values.some(value => Math.abs(value / 4 - Math.round(value / 4)) > 0.03)
            ? [{ element: `${element.tagName.toLowerCase()}.${element.className}`, values }] : [];
        });
        const blockGaps = Array.from(document.querySelectorAll(".case-notes > div")).flatMap(container => Array.from(container.children).slice(1).map(element => {
          const previous = element.previousElementSibling;
          return { from: previous.tagName, to: element.tagName, gap: element.getBoundingClientRect().top - previous.getBoundingClientRect().bottom };
        }));
        const results = document.querySelector("[class*='results'] dl") ?? document.querySelector("dl[aria-labelledby='munchpal-results-caption']");
        return {
          roundSupported: CSS.supports("padding", "round(nearest, 5vw, 4px)"),
          overflow: document.documentElement.scrollWidth - innerWidth,
          offGridPadding,
          blockGaps,
          markedGap: results ? results.nextElementSibling.getBoundingClientRect().top - results.getBoundingClientRect().bottom : null,
        };
      });
      results.push({ route, width, ...measurement });
      console.log(JSON.stringify({ route, width, overflow: measurement.overflow, offGridPadding: measurement.offGridPadding.length, markedGap: measurement.markedGap, tightGaps: measurement.blockGaps.filter(gap => gap.gap < 16) }));
      if (route === "/work/munchpal" && phase !== "stress") {
        await page.locator("#munchpal-evaluation details").scrollIntoViewIfNeeded();
        await page.screenshot({ path: `.scratch/spacing-rhythm/${phase}/munchpal-${width}.png` });
      } else if (phase === "after") {
        await page.screenshot({ path: `.scratch/spacing-rhythm/${phase}/${route.replaceAll("/", "-") || "home"}-${width}.png` });
      }
    }
  }
  await writeFile(`.scratch/spacing-rhythm/${phase}/measurements.json`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
