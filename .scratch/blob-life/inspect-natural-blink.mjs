import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.addInitScript(() => { Math.random = () => 0.1; });
  await page.goto("http://127.0.0.1:3000");
  const blob = page.getByRole("button", { name: "Show role instructions" });
  await blob.waitFor();
  await blob.evaluate(button => {
    const eyes = button.querySelector("[class*='eyes']");
    window.blobSamples = [];
    new MutationObserver(records => {
      if (records.some(record => record.attributeName === "data-blinking") && eyes.hasAttribute("data-blinking")) {
        window.blobSamples.push(performance.now());
      }
    }).observe(eyes, { attributes: true });
  });
  await page.waitForFunction(() => window.blobSamples.length >= 2);
  const result = await blob.evaluate(button => {
    const eyes = button.querySelector("[class*='eyes']");
    const animations = eyes.getAnimations({ subtree: true }).filter(animation => animation instanceof CSSAnimation);
    const frames = animations[0].effect.getKeyframes();
    const phases = [0, 90, 120, 180, 240].map(time => {
      animations.forEach(animation => { animation.pause(); animation.currentTime = time; });
      return {
        time,
        eyes: Array.from(eyes.children, eye => {
          const style = getComputedStyle(eye, "::before");
          return { transform: style.transform, opacity: style.opacity };
        }),
        body: getComputedStyle(button.firstElementChild).transform,
      };
    });
    return {
      blinkStarts: window.blobSamples,
      doubleBlinkGap: window.blobSamples[1] - window.blobSamples[0] - 240,
      duration: animations[0].effect.getTiming().duration,
      frames,
      phases,
    };
  });
  console.log(JSON.stringify({ normal: result }, null, 2));
  await page.waitForFunction(() => {
    const eyes = document.querySelector("[class*='eyes']");
    return eyes.getAnimations().some(animation => !(animation instanceof CSSAnimation));
  }, null, { timeout: 15000 });
  console.log(JSON.stringify({ gaze: await blob.evaluate(button => {
    const eyes = button.querySelector("[class*='eyes']");
    const gaze = eyes.getAnimations().find(animation => !(animation instanceof CSSAnimation));
    return gaze ? { frames: gaze.effect.getKeyframes(), duration: gaze.effect.getTiming().duration } : null;
  }) }, null, 2));
  await page.screenshot({ path: ".scratch/blob-life/natural-blink-desktop.png" });
  await page.evaluate(() => window.blobSamples = []);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForFunction(() => document.querySelector("[data-motion-paused]") !== null);
  await page.waitForTimeout(3700);
  console.log(JSON.stringify({ offscreen: await blob.evaluate(button => ({
    paused: button.closest("[data-motion-paused]") !== null,
    blinkStarts: window.blobSamples,
    blinking: button.querySelector("[class*='eyes']").hasAttribute("data-blinking"),
  })) }, null, 2));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await blob.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.blobSamples = []);
  await page.waitForFunction(() => window.blobSamples.length >= 1, null, { timeout: 15000 });
  console.log(JSON.stringify({ reduced: await blob.evaluate(button => {
    const eyes = button.querySelector("[class*='eyes']");
    const animations = eyes.getAnimations({ subtree: true });
    return {
      starts: window.blobSamples,
      blinkNames: animations.filter(animation => animation instanceof CSSAnimation).map(animation => animation.animationName),
      hasGaze: eyes.getAnimations().length > 0,
      bodyTransform: getComputedStyle(button.firstElementChild).transform,
    };
  }) }, null, 2));
  await page.waitForTimeout(900);
  console.log(JSON.stringify({ reducedBlinkCount: await page.evaluate(() => window.blobSamples.length) }));
} finally {
  await browser.close();
}
