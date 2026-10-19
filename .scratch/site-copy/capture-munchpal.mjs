import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("http://127.0.0.1:3001/work/munchpal");
    await page.evaluate(() => document.fonts.ready);
    await page.locator("#munchpal-revisions img").evaluateAll(images => Promise.all(images.map(image => {
      image.loading = "eager";
      return image.decode();
    })));
    await page.locator("#munchpal-message-title").evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 96));
    await page.getByRole("button", { name: "Open menu", exact: true }).waitFor();
    await page.locator("#munchpal-message-title").evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 96));
    await page.screenshot({ path: `.scratch/site-copy/browser/munchpal-revisions-${width}.png` });
    await page.getByText("Test details", { exact: true }).click();
    await page.locator("#munchpal-evaluation-title").evaluate(element => scrollTo(0, element.getBoundingClientRect().top + scrollY - 96));
    await page.screenshot({ path: `.scratch/site-copy/browser/munchpal-testing-${width}.png` });
    console.log(JSON.stringify({ width, captures: 2, revisionImagesLoaded: await page.locator("#munchpal-revisions img").evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)) }));
  }
} finally { await browser.close(); }
