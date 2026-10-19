import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const directory = ".scratch/spacing-rhythm/balanced-visuals";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [route, selector] of [
      ["/", ".about"], ["/about", "main"], ["/contact", "main"],
      ["/work/paylecta", "#paylecta-states-title"],
      ["/work/pawfriend", ".case-support"], ["/missing-page", "main"],
    ]) {
      await page.goto(`http://127.0.0.1:3000${route}`);
      await page.evaluate(async () => {
        await document.fonts.ready;
        const images = Array.from(document.querySelectorAll("main img"));
        images.forEach(image => { image.loading = "eager"; });
        await Promise.all(images.map(image => image.decode().catch(() => {})));
      });
      const target = page.locator(selector);
      await target.evaluate(element => window.scrollTo(0, element.getBoundingClientRect().top + scrollY - 160));
      await page.screenshot({ path: `${directory}/${route.replaceAll("/", "-") || "home"}-${width}.png`, fullPage: route === "/about" || route === "/contact" });
    }
  }
  const routes = ["/", "/about", "/contact", "/work/aurelia", "/work/pawfriend", "/work/munchpal", "/work/paylecta", "/missing-page"];
  for (const mode of ["large-text", "rtl", "long-labels", "indonesian-labels"]) {
    await page.setViewportSize({ width: mode === "large-text" ? 768 : 390, height: 1000 });
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:3000${route}`);
      await page.locator("main").waitFor();
      await page.evaluate(mode => {
        document.querySelectorAll("main details").forEach(details => { details.open = true; });
        if (mode === "large-text") document.documentElement.style.fontSize = "32px";
        else if (mode === "rtl") document.documentElement.dir = "rtl";
        else {
          const labels = mode === "long-labels"
            ? { Home: "[Höme and selected portfolio work]", About: "[Àbout Alan and professional experience]", Contact: "[Cöntact and prepare an email draft]", "Download resume": "[Döwnload the professional resume document]" }
            : { Home: "Beranda", About: "Tentang saya", Contact: "Kontak", "Download resume": "Unduh resume" };
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            const translated = labels[node.textContent.trim()];
            if (translated) node.textContent = translated;
          }
        }
      }, mode);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      results.push({ route, mode, overflow });
      console.log(JSON.stringify({ route, mode, overflow }));
    }
  }
  await writeFile(`${directory}/adaptivity.json`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
