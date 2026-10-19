import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const directory = process.env.FLOW_REPORT_DIR ?? ".scratch/munchpal-flows/browser";
const baseURL = process.env.FLOW_BASE_URL ?? "http://127.0.0.1:3000";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${baseURL}/work/munchpal#munchpal-media-flow`);
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    for (const theme of ["light", "dark"]) {
      const themeControl = page.getByRole("switch", { name: "Dark theme", exact: true }).first();
      await themeControl.waitFor();
      await page.waitForFunction(() => !document.querySelector(".site-header .theme-toggle").disabled);
      if (await page.evaluate(() => document.documentElement.dataset.theme ?? "light") !== theme) await themeControl.click();
    for (const audience of ["Residents", "Volunteers"]) {
      await page.getByRole("radio", { name: audience, exact: true }).check();
      const panel = page.getByRole("region", { name: `${audience} user flow` });
      await panel.locator("img").evaluate(image => image.decode());
      await page.locator("#munchpal-flow-title").evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - 96));
      await page.screenshot({ path: `${directory}/${audience.toLowerCase()}-${theme}-${width}.png` });
      const measurement = await page.evaluate(async () => {
        const container = document.getElementById("munchpal-media-flow");
        const image = Array.from(container.querySelectorAll("img")).find(image => image.checkVisibility());
        const rect = image.getBoundingClientRect();
        const violations = (await window.axe.run(container)).violations.map(violation => ({ id: violation.id, impact: violation.impact, targets: violation.nodes.map(node => node.target) }));
        return { violations, overflow: document.documentElement.scrollWidth - innerWidth, natural: [image.naturalWidth, image.naturalHeight], rendered: [rect.width, rect.height] };
      });
      results.push({ audience, theme, width, ...measurement });
      console.log(JSON.stringify({ audience, theme, width, ...measurement }));
    }
    }
  }
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const motion = await page.evaluate(() => {
    const indicator = document.querySelector('#munchpal-media-flow fieldset > [aria-hidden="true"]');
    const theme = document.querySelector(".site-header .theme-switch-track");
    return { flowDuration: getComputedStyle(indicator).transitionDuration, flowEase: getComputedStyle(indicator).transitionTimingFunction,
      themeDuration: getComputedStyle(theme, "::before").transitionDuration, themeEase: getComputedStyle(theme, "::before").transitionTimingFunction };
  });
  await writeFile(`${directory}/results.json`, JSON.stringify({ errors, results, motion }, null, 2));
  console.log(JSON.stringify({ errors, motion }));
} finally {
  await browser.close();
}
