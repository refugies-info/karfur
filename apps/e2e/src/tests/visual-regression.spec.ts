import { expect, type TestInfo, test } from "@playwright/test";
import { STATIC_PAGES } from "../pages/static-pages";
import { fetchAllContentIds } from "../utils/fetch-ids";

/**
 * Get viewport name from project name
 */
function getViewportName(projectName: string): string {
  if (projectName.includes("desktop")) return "desktop";
  if (projectName.includes("tablet")) return "tablet";
  if (projectName.includes("mobile")) return "mobile";
  return "unknown";
}

/**
 * Close language modal if present
 * The language modal appears when no language preference is stored
 */
async function closeLanguageModalIfPresent(page: import("@playwright/test").Page) {
  // Language modal has a "Fermer" button
  const closeButton = page.locator("button:has-text('Fermer')").first();
  const isVisible = await closeButton.isVisible({ timeout: 2000 }).catch(() => false);

  if (isVisible) {
    await closeButton.click();
    await page.waitForTimeout(300);
  }
}

/**
 * Accept cookies consent banner if present
 * DSFR consent banner has "Accepter" button
 */
async function acceptCookiesIfPresent(page: import("@playwright/test").Page) {
  // DSFR consent banner - look for "Accepter" button in the banner
  // The banner has class "fr-consent-banner" and contains "Accepter" buttons
  const consentBanner = page.locator(".fr-consent-banner");
  const isBannerVisible = await consentBanner.isVisible({ timeout: 3000 }).catch(() => false);

  if (isBannerVisible) {
    // Click "Accepter" button (or "Tout accepter")
    const acceptButton = consentBanner.locator("button:has-text('Accepter')").first();
    await acceptButton.click();
    await page.waitForTimeout(500);
  }
}

/**
 * Prepare page for screenshot - close modals and banners
 */
async function preparePageForScreenshot(page: import("@playwright/test").Page) {
  // Wait for page to be stable
  await page.waitForLoadState("networkidle");

  // Close language modal if present
  await closeLanguageModalIfPresent(page);

  // Accept cookies if present
  await acceptCookiesIfPresent(page);

  // Wait for animations to complete
  await page.waitForTimeout(500);
}

/**
 * Visual Regression Tests
 *
 * This test suite captures screenshots for:
 * - Static pages (home, legal, etc.)
 * - Dynamic pages (dispositifs, demarches)
 *
 * Run with different projects to capture prod vs staging:
 * - pnpm capture:prod → capture-prod-desktop/tablet/mobile
 * - pnpm capture:staging → capture-staging-desktop/tablet/mobile
 * - pnpm compare → compare-desktop/tablet/mobile
 */

// === STATIC PAGES ===

for (const staticPage of STATIC_PAGES) {
  test(`static: ${staticPage.name}`, async ({ page }, testInfo: TestInfo) => {
    const projectName = testInfo.project.name;
    const viewport = getViewportName(projectName);

    // Navigate to the page
    await page.goto(staticPage.path);

    // Prepare page (close modals/banners)
    await preparePageForScreenshot(page);

    // Take screenshot
    const screenshotName = `static-${staticPage.name.toLowerCase().replace(/\s+/g, "-")}-${viewport}.png`;

    await expect(page).toHaveScreenshot(screenshotName, {
      fullPage: true,
      maxDiffPixels: 1000, // Allow some differences for dynamic content
      threshold: 0.2,
      timeout: 30000,
    });
  });
}

// === DYNAMIC PAGES: DISPOSITIFS ===
// NOTE: Disabled for MVP - API not publicly accessible
// TODO: Use Algolia or a hardcoded list of IDs

test.describe
  .skip("Dispositifs", () => {
    let dispositifIds: string[] = [];

    test.beforeAll(async () => {
      // Fetch IDs once before all tests
      const env = process.env.E2E_ENV === "staging" ? "staging" : "prod";
      const ids = await fetchAllContentIds(env);
      dispositifIds = ids.dispositifs;
    });

    for (let i = 0; i < 5; i++) {
      test(`dispositif #${i + 1}`, async ({ page }, testInfo: TestInfo) => {
        test.skip(!dispositifIds[i], `No dispositif ID at index ${i}`);

        const projectName = testInfo.project.name;
        const viewport = getViewportName(projectName);
        const dispositifId = dispositifIds[i];

        await page.goto(`/dispositif/${dispositifId}`);
        await preparePageForScreenshot(page);

        const screenshotName = `dispositif-${i + 1}-${viewport}.png`;

        await expect(page).toHaveScreenshot(screenshotName, {
          fullPage: true,
          maxDiffPixels: 1000,
          threshold: 0.2,
          timeout: 30000,
        });
      });
    }
  });

// === DYNAMIC PAGES: DEMARCHES ===
// NOTE: Disabled for MVP - API not publicly accessible
// TODO: Use Algolia or a hardcoded list of IDs

test.describe
  .skip("Demarches", () => {
    let demarcheIds: string[] = [];

    test.beforeAll(async () => {
      const env = process.env.E2E_ENV === "staging" ? "staging" : "prod";
      const ids = await fetchAllContentIds(env);
      demarcheIds = ids.demarches;
    });

    for (let i = 0; i < 5; i++) {
      test(`demarche #${i + 1}`, async ({ page }, testInfo: TestInfo) => {
        test.skip(!demarcheIds[i], `No demarche ID at index ${i}`);

        const projectName = testInfo.project.name;
        const viewport = getViewportName(projectName);
        const demarcheId = demarcheIds[i];

        await page.goto(`/demarche/${demarcheId}`);
        await preparePageForScreenshot(page);

        const screenshotName = `demarche-${i + 1}-${viewport}.png`;

        await expect(page).toHaveScreenshot(screenshotName, {
          fullPage: true,
          maxDiffPixels: 1000,
          threshold: 0.2,
          timeout: 30000,
        });
      });
    }
  });
