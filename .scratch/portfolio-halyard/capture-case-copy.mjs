import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
for (const width of [1440, 390]) {
  const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 } });
  for (const slug of ["aurelia", "paylecta", "pawfriend", "munchpal"]) {
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:3000/work/${slug}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(directory, `demos/12-${slug}-${width}.png`) });
    await page.close();
  }
  await context.close();
}
await browser.close();
