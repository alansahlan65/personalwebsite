import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
const results = { browser: browser.version(), server: "next start, production build, localhost:3000", viewport: "1440x900", network: "CDP 150ms latency, 1.6 Mbps down, 0.72 Mbps up", cpu: "4x throttling", routes: [] };

try {
  for (const route of ["/", "/work/aurelia", "/work/paylecta", "/work/pawfriend", "/work/munchpal"]) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(`pageerror: ${error.message}`));
    page.on("console", message => { if (message.type() === "error") errors.push(`console: ${message.text()}`); });
    await page.addInitScript(() => {
      window.__releaseMetrics = { lcp: 0, cls: 0 };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__releaseMetrics.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__releaseMetrics.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 90000 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const response = await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "load" });
    await page.waitForTimeout(2500);
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const fcp = performance.getEntriesByName("first-contentful-paint")[0];
      const resources = performance.getEntriesByType("resource");
      return {
        fcpMs: Math.round(fcp?.startTime ?? 0),
        lcpMs: Math.round(window.__releaseMetrics.lcp),
        cls: Number(window.__releaseMetrics.cls.toFixed(4)),
        loadMs: Math.round(navigation.loadEventEnd),
        transferredKiB: Math.round(resources.reduce((sum, resource) => sum + resource.transferSize, 0) / 1024),
        resources: resources.length,
        images: document.images.length,
        brokenImages: Array.from(document.images).filter(image => image.complete && image.naturalWidth === 0).map(image => image.currentSrc),
        videos: Array.from(document.querySelectorAll("video")).map(video => video.preload),
        width: document.documentElement.scrollWidth,
      };
    });
    results.routes.push({ route, status: response.status(), ...metrics, errors });
    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(directory, "demos/12-performance.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
