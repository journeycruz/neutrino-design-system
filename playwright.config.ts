import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.01
    }
  },
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: "http://127.0.0.1:6006",
    viewport: { width: 1280, height: 720 },
    colorScheme: "light"
  },
  webServer: {
    command: "node tests/visual/static-server.mjs",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [{ name: "chromium" }]
});
