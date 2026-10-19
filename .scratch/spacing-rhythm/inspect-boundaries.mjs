import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const phase = process.argv[2] ?? "before-boundaries";
const baseURL = process.env.SPACING_BASE_URL ?? "http://127.0.0.1:3000";
const widths = process.argv[3] === "stress" ? [320, 650, 768, 1000, 1920] : [390, 1440];
const routes = ["/", "/about", "/contact", "/work/aurelia", "/work/pawfriend", "/work/munchpal", "/work/paylecta", "/missing-page"];
const browser = await chromium.launch();
const results = [];
await mkdir(`.scratch/spacing-rhythm/${phase}`, { recursive: true });
try {
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      await page.goto(`${baseURL}${route}`);
      await page.locator("main").waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => {
        const images = Array.from(document.querySelectorAll("main img"));
        images.forEach(image => { image.loading = "eager"; });
        await Promise.all(images.map(image => image.decode().catch(() => {})));
      });
      const measurement = await page.evaluate(() => {
        const root = document.querySelector("main");
        function contentBounds(container) {
          const boxes = Array.from(container.querySelectorAll("*")).filter(element => {
            const style = getComputedStyle(element);
            const paintedSurface = style.backgroundColor !== "rgba(0, 0, 0, 0)" || style.backgroundImage !== "none";
            if (!paintedSurface && !element.matches("h1,h2,h3,p,a,summary,figcaption,img,video,ul,ol,dl,button,input,textarea")) return false;
            if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) return false;
            if (element.closest('[aria-hidden="true"]') || (element.closest("video") && element.tagName !== "VIDEO")) return false;
            const rect = element.getBoundingClientRect();
            if (!rect.width || !rect.height) return false;
            for (let parent = element; parent && parent !== container; parent = parent.parentElement) {
              const style = getComputedStyle(parent);
              if (style.visibility === "hidden" || style.opacity === "0" || style.position === "fixed") return false;
              if (parent.tagName === "DETAILS" && !parent.open && !parent.querySelector(":scope > summary")?.contains(element)) return false;
            }
            return true;
          }).map(element => {
            const bounds = element.getBoundingClientRect();
            const rect = { top: bounds.top, bottom: bounds.bottom, left: bounds.left, right: bounds.right };
            for (let parent = element.parentElement; parent; parent = parent.parentElement) {
              const style = getComputedStyle(parent);
              const clip = parent.getBoundingClientRect();
              if (["hidden", "clip", "auto", "scroll"].includes(style.overflowY)) {
                rect.top = Math.max(rect.top, clip.top);
                rect.bottom = Math.min(rect.bottom, clip.bottom);
              }
              if (["hidden", "clip", "auto", "scroll"].includes(style.overflowX)) {
                rect.left = Math.max(rect.left, clip.left);
                rect.right = Math.min(rect.right, clip.right);
              }
              if (parent === container) break;
            }
            return rect;
          }).filter(rect => rect.bottom > rect.top && rect.right > rect.left);
          return boxes.length ? { top: Math.min(...boxes.map(rect => rect.top)), bottom: Math.max(...boxes.map(rect => rect.bottom)) } : null;
        }
        const sections = Array.from(root.children).flatMap(child => {
          if (child.tagName === "DIV" && !child.classList.contains("page-width") && Array.from(child.children).every(element => element.tagName === "SECTION")) return Array.from(child.children);
          return [child];
        }).map(element => ({
          name: element.querySelector("h1,h2")?.textContent ?? element.getAttribute("aria-label") ?? element.id ?? element.tagName,
          padding: [getComputedStyle(element).paddingTop, getComputedStyle(element).paddingBottom],
          rect: contentBounds(element),
        })).filter(section => section.rect);
        const gaps = sections.slice(1).map((section, index) => ({ from: sections[index].name, to: section.name, gap: section.rect.top - sections[index].rect.bottom }));
        const evaluation = document.querySelector("#munchpal-evaluation");
        const support = document.querySelector(".case-support");
        const method = evaluation?.querySelector("details");
        const firstSource = support?.querySelector("a");
        const closingNotes = support?.querySelector(":scope > .case-notes");
        const returnLink = support?.querySelector(":scope > .case-return");
        return {
          sections, gaps,
          overflow: document.documentElement.scrollWidth - innerWidth,
          markedGap: method && firstSource ? firstSource.getBoundingClientRect().top - method.getBoundingClientRect().bottom : null,
          closingReturnGap: closingNotes && returnLink ? returnLink.getBoundingClientRect().top - closingNotes.getBoundingClientRect().bottom : null,
          footerGap: contentBounds(root) && contentBounds(document.querySelector("footer"))
            ? contentBounds(document.querySelector("footer")).top - contentBounds(root).bottom : null,
        };
      });
      results.push({ route, width, ...measurement });
      console.log(JSON.stringify({ route, width, gaps: measurement.gaps, footerGap: measurement.footerGap, markedGap: measurement.markedGap, closingReturnGap: measurement.closingReturnGap, overflow: measurement.overflow }));
      if (route === "/work/munchpal" && process.argv[3] !== "stress") {
        await page.locator("#munchpal-evaluation").scrollIntoViewIfNeeded();
        await page.screenshot({ path: `.scratch/spacing-rhythm/${phase}/munchpal-${width}.png` });
        await page.locator("#munchpal-evaluation details").evaluate(details => { details.open = true; });
        console.log(JSON.stringify({ route, width, openMarkedGap: await page.evaluate(() => {
          const details = document.querySelector("#munchpal-evaluation details");
          const link = document.querySelector(".case-support a");
          return link.getBoundingClientRect().top - details.getBoundingClientRect().bottom;
        }) }));
      }
    }
  }
  await writeFile(`.scratch/spacing-rhythm/${phase}/measurements.json`, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
