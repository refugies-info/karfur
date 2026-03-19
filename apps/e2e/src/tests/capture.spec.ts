import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import { STATIC_PAGES } from "../pages/static-pages";

/**
 * Screenshot Capture Tests
 *
 * Captures screenshots to organized folders:
 * - screenshots/prod/  → Production screenshots
 * - screenshots/staging/ → Staging screenshots
 *
 * Then use `pnpm compare` to compare the folders.
 */

const ENVIRONMENTS = {
  prod: "https://refugies.info",
  staging: "https://staging.refugies.info",
  local: "http://localhost:3000",
} as const;

/**
 * Close language modal if present
 */
async function closeLanguageModalIfPresent(page: import("@playwright/test").Page) {
  const closeButton = page.locator("button:has-text('Fermer')").first();
  const isVisible = await closeButton.isVisible({ timeout: 2000 }).catch(() => false);
  if (isVisible) {
    await closeButton.click();
    await page.waitForTimeout(300);
  }
}

/**
 * Accept cookies consent banner if present
 */
async function acceptCookiesIfPresent(page: import("@playwright/test").Page) {
  const consentBanner = page.locator(".fr-consent-banner");
  const isBannerVisible = await consentBanner.isVisible({ timeout: 3000 }).catch(() => false);
  if (isBannerVisible) {
    const acceptButton = consentBanner.locator("button:has-text('Accepter')").first();
    await acceptButton.click();
    await page.waitForTimeout(500);
  }
}

/**
 * Prepare page for screenshot
 */
async function preparePageForScreenshot(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
  await closeLanguageModalIfPresent(page);
  await acceptCookiesIfPresent(page);
  await page.waitForTimeout(500);
}

/**
 * Get environment from project name
 */
function getEnvironment(projectName: string): "prod" | "staging" | "local" {
  if (projectName.includes("prod")) return "prod";
  if (projectName.includes("staging")) return "staging";
  if (projectName.includes("local")) return "local";
  return "prod"; // default
}

/**
 * Get viewport from project name
 */
function getViewport(projectName: string): string {
  if (projectName.includes("desktop")) return "desktop";
  if (projectName.includes("tablet")) return "tablet";
  if (projectName.includes("mobile")) return "mobile";
  return "desktop";
}

// === CAPTURE TESTS ===

for (const staticPage of STATIC_PAGES) {
  test(`capture: ${staticPage.name}`, async ({ page }, testInfo) => {
    const env = getEnvironment(testInfo.project.name);
    const viewport = getViewport(testInfo.project.name);
    const baseUrl = ENVIRONMENTS[env];

    // Navigate to page
    await page.goto(`${baseUrl}${staticPage.path}`);

    // Prepare page
    await preparePageForScreenshot(page);

    // Create output directory
    const screenshotDir = path.join(process.cwd(), "screenshots", env, viewport);
    await fs.promises.mkdir(screenshotDir, { recursive: true });

    // Generate filename
    const filename = `${staticPage.name.toLowerCase().replace(/\s+/g, "-")}.png`;
    const screenshotPath = path.join(screenshotDir, filename);

    // Take screenshot
    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
    });

    // Attach to report
    testInfo.attach(`${env}-${viewport}-${staticPage.name}`, {
      path: screenshotPath,
    });
  });
}
