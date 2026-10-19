import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const phase = process.env.SMOOTH_PHASE ?? "before";
const directory = ".scratch/munchpal-flows/smoothness";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:3000/work/munchpal#munchpal-media-flow");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => !document.querySelector(".site-header .theme-toggle").disabled);
    await page.getByRole("radio", { name: "Residents", exact: true }).check();
    await page.locator('#munchpal-media-flow fieldset > [aria-hidden="true"]').evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
    for (const [kind, name] of [["flow", "Volunteers"], ["flow", "Residents"], ["flow", "Volunteers"], ["theme", "Dark theme"], ["theme", "Dark theme"]]) {
      const control = page.getByRole(kind === "flow" ? "radio" : "switch", { name, exact: true }).first();
      await control.scrollIntoViewIfNeeded();
      await page.evaluate(kind => {
        const target = kind === "flow" ? document.querySelector('#munchpal-media-flow fieldset > [aria-hidden="true"]') : document.querySelector('.compact-menu-rail .theme-switch-track');
        const pseudo = kind === "theme" ? "::before" : null;
        const style = () => getComputedStyle(target, pseudo);
        const initial = new DOMMatrixReadOnly(style().transform).m41;
        const starting = { duration: style().transitionDuration, easing: style().transitionTimingFunction, width: style().width, initial };
        window.smoothness = new Promise(resolve => {
          document.addEventListener("click", () => {
            const start = performance.now();
            const samples = [];
            const tick = () => {
              const time = performance.now() - start;
              const current = new DOMMatrixReadOnly(style().transform);
              samples.push({ time, x: current.m41, y: current.m42 });
              if (time < 360) requestAnimationFrame(tick);
              else resolve({ ...starting, samples, final: samples.at(-1).x,
                focusVisible: document.activeElement.matches(":focus-visible"),
                loadedMaps: Array.from(document.querySelectorAll('#munchpal-media-flow img')).map(image => image.naturalWidth) });
            };
            requestAnimationFrame(tick);
          }, { once: true, capture: true });
        });
      }, kind);
      await control.click();
      const measured = await page.evaluate(() => window.smoothness);
      const travel = Math.abs(measured.final - measured.initial);
      const firstMotion = measured.samples.find(sample => Math.abs(sample.x - measured.initial) > .01);
      const half = measured.samples.find(sample => Math.abs(sample.x - measured.initial) >= travel / 2);
      const gaps = measured.samples.slice(1).map((sample, index) => sample.time - measured.samples[index].time);
      const result = { width, kind, name, ...measured, travel, firstMotion, half, largestGap: Math.max(...gaps) };
      results.push(result);
      console.log(JSON.stringify({ width, kind, name, duration: result.duration, easing: result.easing, travel, firstMotion, half, largestGap: result.largestGap, focusVisible: result.focusVisible, loadedMaps: result.loadedMaps }));
    }
  }
  await writeFile(`${directory}/${phase}.json`, JSON.stringify(results, null, 2));
} finally { await browser.close(); }
