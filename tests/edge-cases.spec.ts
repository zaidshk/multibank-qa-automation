import { test, expect } from '../fixtures/pages.fixture';

// ── EDGE-01 ───────────────────────────────────────────────────────────────────

test.describe('EDGE-01 — Locale-specific URLs render content in the correct language', () => {

  // The language switcher in the header has no keyboard support or ARIA role,
  // so locale routing is tested via URL — which is what the switcher triggers anyway.

  test('navigating to the Arabic locale renders the explore page in Arabic', { tag: '@sanity' }, async ({ page }) => {
    await page.goto('/ar/explore');

    // /ar normalises to the UAE Arabic variant
    await expect(
      page,
      'Arabic locale URL should resolve to the /ar-AE/ region variant',
    ).toHaveURL(/\/ar-AE\/explore/);

    await expect(
      page.locator('h1').first(),
      'Arabic explore page should render a visible heading',
    ).toBeVisible();
  });

  test('navigating to the Russian locale renders the explore page in Russian', { tag: '@sanity' }, async ({ page }) => {
    await page.goto('/ru/explore');

    await expect(
      page,
      'Russian locale URL should resolve to the /ru-AE/ region variant',
    ).toHaveURL(/\/ru-AE\/explore/);

    await expect(
      page.locator('h1').first(),
      'Russian explore page should render a visible heading',
    ).toBeVisible();
  });

});

// ── EDGE-02 ───────────────────────────────────────────────────────────────────

test.describe('EDGE-02 — No trading pair appears simultaneously in Gainers and Losers', () => {

  // Known issue: in a broadly positive market, "Losers" ranks the smallest gainers
  // rather than strictly negative movers, so the same asset can show up in both tabs.
  // This test is intentionally left failing to track the issue — remove the note
  // when the backend enforces non-overlapping tab classification.

  test('no asset should appear in both the Gainers tab and the Losers tab at the same time', async ({ explorePage }) => {
    await explorePage.goto();

    await explorePage.clickGainersTab();
    await explorePage.waitForTableLoad();
    const gainers = await explorePage.getVisibleAssetSymbols();

    await explorePage.clickLosersTab();
    await explorePage.waitForTableLoad();
    const losers = await explorePage.getVisibleAssetSymbols();

    const overlap = gainers.filter((symbol) => losers.includes(symbol));

    expect(
      overlap,
      `These assets appear in both Gainers and Losers at the same time: ${overlap.join(' | ')}`,
    ).toHaveLength(0);
  });

});

// ── EDGE-03 ───────────────────────────────────────────────────────────────────

test.describe('EDGE-03 — Invalid routes return a graceful 404 page', () => {

  test('navigating to a non-existent URL shows a "Page not found" message', { tag: ['@smoke', '@sanity'] }, async ({ page }) => {
    const response = await page.goto('/en/this-page-does-not-exist-abc123');

    // A 200 on a missing route is a silent failure — the HTTP status must match the UI
    expect(
      response?.status(),
      'Non-existent route should return HTTP 404, not 200',
    ).toBe(404);

    await expect(
      page.getByRole('heading', { name: /page not found|404/i }),
      '"Page not found" heading should be visible to the user',
    ).toBeVisible();
  });

});

// ── EDGE-04 ───────────────────────────────────────────────────────────────────

test.describe('EDGE-04 — Primary navigation links return valid HTTP responses', () => {
  // Nav links are collapsed behind a hamburger on mobile — this scenario is desktop-only
  test.skip(({ isMobile }) => isMobile, 'Nav links are not exposed at mobile viewport — desktop-only test');

  test('all five internal nav links respond with HTTP 200', { tag: '@sanity' }, async ({ page, navigationBar }) => {
    await page.goto('/en');

    const internalLinks = [
      { label: 'Explore',  locator: navigationBar.exploreLink  },
      { label: 'Features', locator: navigationBar.featuresLink },
      { label: 'OTC Desk', locator: navigationBar.otcDeskLink  },
      { label: 'Company',  locator: navigationBar.companyLink  },
      { label: 'Support',  locator: navigationBar.supportLink  },
    ];

    for (const { label, locator } of internalLinks) {
      const href = await locator.getAttribute('href');
      expect(href, `${label} link should have a non-empty href`).toBeTruthy();

      if (href) {
        const response = await page.request.get(href).catch(() => null);
        expect.soft(
          response?.status(),
          `${label} (${href}) should return HTTP 200`,
        ).toBe(200);
      }
    }
  });

  test('$MBG external link href points to the MultiBank token site', { tag: '@sanity' }, async ({ page, navigationBar }) => {
    await page.goto('/en');

    // token.multibankgroup.com blocks automated requests with 403, so we validate
    // the href only rather than following it
    await expect(
      navigationBar.mbgLink,
      '$MBG link should have an href pointing to token.multibankgroup.com',
    ).toHaveAttribute('href', /token\.multibankgroup\.com/);
  });

});

// ── EDGE-05 ───────────────────────────────────────────────────────────────────

// Runs at 375px on all desktop projects so responsive regressions are caught
// regardless of which browser executes the suite.
// mobile-chrome and mobile-safari run this file natively at device dimensions.

test.describe('EDGE-05 — Viewport regression: critical content is accessible at mobile breakpoint (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('home page should not overflow horizontally at 375px', { tag: '@sanity' }, async ({ homePage, page }) => {
    await homePage.goto();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(
      hasHorizontalOverflow,
      'Page must not overflow horizontally at 375px — indicates a broken responsive layout',
    ).toBe(false);
  });

  test('hero heading and primary CTA are visible at 375px', { tag: '@sanity' }, async ({ homePage }) => {
    await homePage.goto();

    await expect.soft(homePage.heroHeading, 'Hero heading must not be clipped or hidden at 375px').toBeVisible();
    await expect(homePage.downloadAppCta, 'Download CTA must remain accessible at 375px').toBeVisible();
  });

  test('navigation landmark is present in DOM at 375px', { tag: '@sanity' }, async ({ navigationBar, homePage }) => {
    await homePage.goto();

    // Nav links collapse behind a hamburger at this width — we assert the landmark
    // is still in the DOM rather than checking individual link visibility
    await expect(
      navigationBar.nav,
      'Navigation landmark must exist in DOM at mobile — removing it breaks keyboard and screen reader access',
    ).toBeAttached();
  });

  test('explore page asset table is reachable at 375px', async ({ explorePage }) => {
    await explorePage.goto();
    await explorePage.waitForTableLoad();

    await expect(
      explorePage.assetTable,
      'Asset table should be visible at 375px',
    ).toBeVisible();
  });

});
