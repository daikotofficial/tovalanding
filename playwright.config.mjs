import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://localhost:4173",
    headless: true,
    channel: "chromium",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 120000,
  },
  reporter: "list",
});
