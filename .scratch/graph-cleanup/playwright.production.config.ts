import { defineConfig } from "@playwright/test";
import base from "../../playwright.config";
import path from "node:path";

const root = path.resolve(__dirname, "../..");

export default defineConfig({
  ...base,
  testDir: path.join(root, "tests"),
  outputDir: path.join(root, "test-results/graph-cleanup"),
  reporter: [["list"], ["json", { outputFile: path.join(root, ".scratch/graph-cleanup/browser-results.json") }]],
  retries: 0,
  use: base.use,
  webServer: {
    command: "npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
