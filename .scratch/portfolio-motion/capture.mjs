import { chromium } from "playwright";

const base = "http://127.0.0.1:3000";
const browser = await chromium.launch();
const captures = [
  { name: "home-top-desktop", route: "/", width: 1440, height: 900 },
  { name: "home-work-desktop", route: "/", width: 1440, height: 900, selector: "#work" },
  { name: "home-about-desktop", route: "/", width: 1440, height: 900, selector: "#about" },
  { name: "about-desktop", route: "/about", width: 1440, height: 900 },
  { name: "case-desktop", route: "/work/aurelia", width: 1440, height: 900 },
  { name: "home-top-mobile", route: "/", width: 390, height: 844 },
  { name: "home-work-mobile", route: "/", width: 390, height: 844, selector: "#work" },
  { name: "case-mobile", route: "/work/aurelia", width: 390, height: 844 },
];

for (const capture of captures) {
  const page = await browser.newPage({ viewport: { width: capture.width, height: capture.height }, reducedMotion: "no-preference" });
  await page.goto(`${base}${capture.route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  if (capture.selector) {
    await page.locator(capture.selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
  }
  await page.screenshot({ path: `.scratch/portfolio-motion/${capture.name}.png` });
  await page.close();
}

await browser.close();
