import { test, expect } from '../../fixtures/pages.fixture';

// ── BONUS-02 ──────────────────────────────────────────────────────────────────

// Visual regression suite for the explore page.
// Run with: npm run test:visual
//
// Baseline snapshots are generated on the first run:
//   npx playwright test --project=visual --update-snapshots
//
// Subsequent runs compare against the committed baseline. Any structural change
// to the layout will produce a diff and fail the test.

test.describe('BONUS-02 — Visual regression: explore page layout', () => {

  test('promotional banner strip matches the visual baseline', async ({ explorePage, page }) => {
    await explorePage.goto();
    await explorePage.waitForTableLoad();

    // Mask the asset table entirely — live prices would produce a diff on every run
    await expect(page).toHaveScreenshot('explore-banners.png', {
      maxDiffPixelRatio: 0.03,
      mask: [explorePage.assetTable],
      fullPage: false,
    });
  });

  test('spot market tab bar matches the visual baseline', async ({ explorePage }) => {
    await explorePage.goto();
    await explorePage.waitForTableLoad();

    // The tabs render as buttons without a tablist role — locate the shared parent
    // of the Hot tab to capture all three tabs in one element
    const tabBar = explorePage.hotTab.locator('..');

    await expect(tabBar).toHaveScreenshot('explore-tab-bar.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

  test('page heading region matches the visual baseline', async ({ explorePage, page }) => {
    await explorePage.goto();

    const heading = explorePage.pageHeading;
    await expect(heading).toBeVisible();

    await expect(heading).toHaveScreenshot('explore-heading.png', {
      maxDiffPixelRatio: 0.02,
    });
  });

});
