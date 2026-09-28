import { chromium } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "demos");
const baseURL = "http://127.0.0.1:3000";

async function capture(browser, name, run) {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: out, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  try {
    await run(page);
    await page.waitForTimeout(450);
  } finally {
    const video = page.video();
    await context.close();
    await video.saveAs(path.join(out, `12-${name}.webm`));
  }
}

(async () => {
  const browser = await chromium.launch();
  try {
    await capture(browser, "header-menu", async (page) => {
      await page.goto("/");
      await page.evaluate(() => window.scrollTo(0, 170));
      await page.locator(".compact-menu-trigger").click();
      await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "Work", exact: true }).hover();
      await page.waitForTimeout(850);
      await page.getByRole("dialog", { name: "Navigation menu" }).getByRole("link", { name: "About", exact: true }).click();
      await page.getByRole("heading", { level: 1, name: /Product Designer/ }).waitFor();
    });
    await capture(browser, "gallery-cursor", async (page) => {
      await page.goto("/#work");
      for (const slug of ["aurelia", "paylecta", "pawfriend", "munchpal"]) {
        const row = page.locator(`.project-row[data-project="${slug}"]`);
        await row.getByRole("heading").hover();
        await page.waitForTimeout(450);
        await row.locator(".project-banner-expanded").hover();
        await page.waitForTimeout(220);
      }
      await page.locator('.project-row[data-project="munchpal"] .project-link').click();
      await page.getByRole("heading", { level: 1, name: "Munchpal" }).waitFor();
    });
    await capture(browser, "role-parallax", async (page) => {
      await page.goto("/");
      const start = await page.locator(".roles").evaluate(element => element.getBoundingClientRect().top + scrollY - 400);
      for (const offset of [0, 160, 320, 500, 680, 500, 320, 160, 0]) {
        await page.evaluate(y => window.scrollTo(0, y), start + offset);
        await page.waitForTimeout(330);
      }
    });
    await capture(browser, "munchpal-journey", async (page) => {
      await page.goto("/work/munchpal");
      await page.locator(".case-hero img").scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      const media = page.locator(".case-media");
      await media.scrollIntoViewIfNeeded();
      const top = await media.evaluate(element => element.getBoundingClientRect().top + scrollY);
      for (const offset of [0, 700, 1400, 2100, 2800, 3500]) {
        await page.evaluate(y => window.scrollTo(0, y), top + offset);
        await page.waitForTimeout(380);
      }
      await media.getByRole("link", { name: /Skip/ }).click();
      await page.waitForTimeout(550);
      await page.getByRole("link", { name: /Back to selected work/ }).last().click();
      await page.getByRole("heading", { name: "Selected work" }).waitFor();
    });
    const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto("/work/unknown-project");
    await page.screenshot({ path: path.join(out, "12-not-found-mobile.png"), fullPage: true });
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
