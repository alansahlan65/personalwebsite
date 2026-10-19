import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const cases = [
  ["flex-design-system", "https://www.evanyudis.com/p/flex-design-system"],
  ["tokopedia-purchase-flow", "https://www.evanyudis.com/p/tokopedia-purchase-flow"],
];
for (const [name, url] of cases) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(2500);
    const text = await page.locator("main").count() ? await page.locator("main").first().innerText() : await page.locator("body").innerText();
    await fs.writeFile(path.join(directory, `reference-${name}.txt`), `URL: ${url}\nStatus: ${response?.status()}\nTitle: ${await page.title()}\n\n${text}\n`);
    await page.screenshot({ path: path.join(directory, `reference-${name}.png`), fullPage: false });
    console.log(`${name}: ${response?.status()}, ${text.length} characters`);
  } catch (error) {
    console.log(`${name}: ${error.message}`);
  }
  await page.close();
}
await browser.close();
