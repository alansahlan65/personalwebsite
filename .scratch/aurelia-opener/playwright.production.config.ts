import { defineConfig } from "@playwright/test";
import config from "../../playwright.config";

export default defineConfig({
  ...config,
  testDir: "../../tests",
  webServer: undefined,
  use: { ...config.use, baseURL: "http://127.0.0.1:3001" },
});
