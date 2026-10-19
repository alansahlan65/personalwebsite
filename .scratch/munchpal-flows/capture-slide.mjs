import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const directory = process.env.FLOW_MOTION_DIRECTORY ?? ".scratch/munchpal-flows/motion";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("http://127.0.0.1:3000/work/munchpal#munchpal-media-flow");
  await page.waitForFunction(() => !document.querySelector(".site-header .theme-toggle").disabled);
  await page.evaluate(() => document.fonts.ready);
  const indicator = page.locator('#munchpal-media-flow fieldset > [aria-hidden="true"]');
  const parts = page.locator('#munchpal-media-flow fieldset > [aria-hidden="true"], #munchpal-media-flow fieldset > [aria-hidden="true"] > span');
  const fieldset = page.locator("#munchpal-media-flow fieldset");
  // Slow only this inspection to four times the shipped 250ms duration.
  await parts.evaluateAll(elements => elements.forEach(element => { element.style.transitionDuration = "1s"; }));
  await page.getByRole("radio", { name: "Volunteers", exact: true }).check();
  await page.mouse.move(0, 0);
  await parts.evaluateAll(elements => elements.forEach(element => {
    const animation = element.getAnimations().find(animation => animation instanceof CSSTransition);
    if (!animation) throw new Error("Expected the selection slide");
    animation.pause();
  }));
  const frames = [];
  for (const time of [0, 240, 480, 1000]) {
    await parts.evaluateAll((elements, time) => elements.forEach(element => {
      element.getAnimations().find(animation => animation instanceof CSSTransition).currentTime = time;
    }), time);
    const state = await indicator.evaluate((element, time) => {
      const style = getComputedStyle(element);
      return { time, transform: style.transform, duration: Number.parseFloat(style.transitionDuration) * 1000, easing: style.transitionTimingFunction };
    }, time);
    await fieldset.screenshot({ path: `${directory}/slide-${time}.png` });
    frames.push(state);
  }
  await writeFile(`${directory}/frames.json`, JSON.stringify(frames, null, 2));
  console.log(JSON.stringify(frames));
} finally { await browser.close(); }
