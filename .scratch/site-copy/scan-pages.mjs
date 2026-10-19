import { chromium } from "@playwright/test";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const baseURL = process.env.COPY_BASE_URL ?? "http://127.0.0.1:3000";
const directory = ".scratch/site-copy/browser";
const routes = ["/", "/about", "/contact", "/work/aurelia", "/work/paylecta", "/work/pawfriend", "/work/munchpal", "/copy-review-missing"];
const browser = await chromium.launch();
await mkdir(directory, { recursive: true });
const results = [];
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      const errors = [];
      const onError = error => errors.push(error.message);
      page.on("pageerror", onError);
      const response = await page.goto(`${baseURL}${route}`);
      await page.evaluate(() => document.fonts.ready);
      const defaultCopy = await page.locator("main").innerText();
      await page.locator("main details").evaluateAll(elements => elements.forEach(element => { element.open = true; }));
      const expandedCopy = await page.locator("main").innerText();
      const layout = await page.evaluate(() => {
        const unresolved = Array.from(document.querySelectorAll("[aria-describedby], [aria-labelledby], [aria-controls]")).flatMap(element =>
          ["aria-describedby", "aria-labelledby", "aria-controls"].flatMap(attribute =>
            (element.getAttribute(attribute) ?? "").split(/\s+/).filter(Boolean).filter(id => !document.getElementById(id)).map(id => ({ attribute, id }))));
        return { overflow: document.documentElement.scrollWidth - innerWidth, unresolved };
      });
      const violations = [];
      if (width === 390 || width === 1440) {
        await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
        violations.push(...await page.evaluate(async () => (await window.axe.run()).violations.map(violation => ({ id: violation.id, impact: violation.impact, targets: violation.nodes.map(node => node.target) }))));
      }
      const record = { route, width, status: response.status(), defaultWords: defaultCopy.trim().split(/\s+/).length, ...layout, violations, errors };
      results.push(record);
      console.log(JSON.stringify(record));
      if (width === 390 || width === 1440) {
        const name = route === "/" ? "home" : route.split("/").at(-1);
        await writeFile(`${directory}/${name}-${width}.txt`, `${defaultCopy}\n\n--- Expanded detail ---\n\n${expandedCopy}`);
        await page.locator("main details").evaluateAll(elements => elements.forEach(element => { element.open = false; }));
        if (route === "/work/munchpal") {
          await page.locator("#munchpal-message-title").evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 96));
          await page.screenshot({ path: `${directory}/munchpal-revisions-${width}.png` });
          await page.getByText("Test details", { exact: true }).click();
          await page.locator("#munchpal-evaluation-title").evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 96));
          await page.screenshot({ path: `${directory}/munchpal-testing-${width}.png` });
        } else {
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({ path: `${directory}/${name}-${width}.png` });
        }
      }
      page.off("pageerror", onError);
    }
  }
  await writeFile(`${directory}/results.json`, JSON.stringify(results, null, 2));
  if (results.some(result => result.overflow > 0 || result.unresolved.length || result.violations.length || result.errors.length || result.status !== (result.route === "/copy-review-missing" ? 404 : 200))) process.exitCode = 1;
} finally { await browser.close(); }
