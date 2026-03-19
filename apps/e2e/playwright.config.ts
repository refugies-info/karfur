import { defineConfig, devices } from "@playwright/test";

/**
 * Visual Regression Testing Configuration
 *
 * Projects:
 * - capture-prod: Capture screenshots from production (baseline)
 * - capture-staging: Capture screenshots from staging
 * - compare: Compare staging vs prod
 *
 * Viewports: Desktop (1920x1080), Tablet (768x1024), Mobile (375x812)
 */
export default defineConfig({
  testDir: "./src/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { outputFolder: "playwright-report" }]],

  use: {
    baseURL: process.env.E2E_BASE_URL || "https://refugies.info",
    trace: "on-first-retry",
    screenshot: "on",
    video: "retain-on-failure",
  },

  projects: [
    // === CAPTURE PRODUCTION ===
    {
      name: "capture-prod-desktop",
      use: {
        baseURL: "https://refugies.info",
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "capture-prod-tablet",
      use: {
        baseURL: "https://refugies.info",
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: "capture-prod-mobile",
      use: {
        baseURL: "https://refugies.info",
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
      },
    },

    // === CAPTURE LOCAL ===
    {
      name: "capture-local-desktop",
      use: {
        baseURL: "http://localhost:3000",
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "capture-local-tablet",
      use: {
        baseURL: "http://localhost:3000",
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: "capture-local-mobile",
      use: {
        baseURL: "http://localhost:3000",
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 3,
      },
    },
  ],
});
