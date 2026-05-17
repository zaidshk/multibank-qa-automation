import { test, expect } from '../fixtures/pages.fixture';

test.describe('Content & Links', () => {

  // ── CONTENT-01 ────────────────────────────────────────────────────────────────

  test.describe('CONTENT-01 — Promotional banners render with headings and sub-labels', () => {

    test('explore page shows all three promotional banners with correct headings and sub-labels', { tag: '@sanity' }, async ({ explorePage }) => {
      await explorePage.goto();

      // Banner 1 — Earn interest
      await expect.soft(
        explorePage.earnInterestBanner,
        '"Earn interest on your assets" banner heading should be visible',
      ).toBeVisible();
      await expect.soft(
        explorePage.earnInterestBannerSubLabel,
        '"Up to 25% APY" sub-label should be visible beneath the earn interest banner',
      ).toBeVisible();

      // Banner 2 — Crypto with card
      await expect.soft(
        explorePage.cryptoWithCardBanner,
        '"Get crypto with your card" banner heading should be visible',
      ).toBeVisible();
      await expect.soft(
        explorePage.cryptoWithCardBannerSubLabel,
        '"Instant buy" sub-label should be visible beneath the crypto card banner',
      ).toBeVisible();

      // Banner 3 — Deposits
      await expect.soft(
        explorePage.depositsBanner,
        '"Deposits using card or wire transfer" banner heading should be visible',
      ).toBeVisible();
      await expect(
        explorePage.depositsBannerSubLabel,
        '"Top up today" sub-label should be visible beneath the deposits banner',
      ).toBeVisible();
    });

  });

  // ── CONTENT-02 ────────────────────────────────────────────────────────────────

  test.describe('CONTENT-02 — App download CTA resolves to an official app store', () => {

    test('explore page "Download the app" CTA is visible and is a link with a non-empty href', { tag: '@sanity' }, async ({ explorePage }) => {
      await explorePage.goto();

      await expect(
        explorePage.downloadAppCta,
        '"Download the app" CTA should be visible on the explore page',
      ).toBeVisible();

      // The CTA is a link element — assert it carries a valid href before navigating
      await expect(
        explorePage.downloadAppCta,
        '"Download the app" should be a link with a non-empty href',
      ).toHaveAttribute('href', /^https?:\/\/.+/);
    });

    test('following the "Download the app" link redirects to an official app store', { tag: '@sanity' }, async ({ explorePage, page }) => {
      await explorePage.goto();

      const href = await explorePage.downloadAppCta.getAttribute('href');
      expect(href, '"Download the app" href must not be empty').toBeTruthy();

      // Smart links are device-aware — use an iOS UA so Apple's CDN routes to the
      // App Store rather than the web fallback.
      // We walk the redirect chain one hop at a time (maxRedirects: 0) so we can
      // inspect each Location header without the HTTP client ever attempting to
      // open a custom URI scheme (itms-appss://) which would throw on any platform.
      const iosSafariUA =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
        'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

      let nextUrl: string = href!;
      let landedOnStore = false;

      for (let hop = 0; hop < 10 && !landedOnStore; hop++) {
        const response = await page.request.get(nextUrl, {
          headers: { 'User-Agent': iosSafariUA },
          maxRedirects: 0,
          failOnStatusCode: false,
        });

        const location = response.headers()['location'] ?? '';
        const urlToCheck = location || response.url();

        if (/apps\.apple\.com/.test(urlToCheck) || /play\.google\.com/.test(urlToCheck)) {
          landedOnStore = true;
          break;
        }

        // Stop when there is no further redirect, or the next hop is a non-HTTPS
        // scheme (e.g. itms-appss://) that confirms we have reached the App Store.
        if (!location || !location.startsWith('https')) break;
        nextUrl = location;
      }

      expect(
        landedOnStore,
        `App download link should redirect to Apple App Store or Google Play when requested with an iOS UA`,
      ).toBe(true);
    });

  });

  // ── CONTENT-03 ────────────────────────────────────────────────────────────────

  test.describe('CONTENT-03 — Company page renders all expected headings, stats, and pillars', () => {

    test('company page displays the main heading and all five section headings', { tag: '@sanity' }, async ({ companyPage }) => {
      await companyPage.goto();

      await expect(
        companyPage.mainHeading,
        '"Why MultiBank Group?" main heading should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.globalLeadershipSection,
        '"A tradition of global leadership" section heading should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.innovationSection,
        '"Innovation with Purpose" section heading should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.integritySection,
        '"Integrity Built into Every Decision" section heading should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.strengthSection,
        '"The Strength Behind MultiBank Group" section heading should be visible',
      ).toBeVisible();

      await expect(
        companyPage.communitySection,
        '"Community & Media" section heading should be visible',
      ).toBeVisible();
    });

    test('company page displays the key statistics', { tag: '@sanity' }, async ({ companyPage }) => {
      await companyPage.goto();

      await expect.soft(
        companyPage.annualTurnoverStat,
        '$2 trillion annual turnover figure should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.customerCountStat,
        '2,000,000+ customers worldwide figure should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.officesCountStat,
        '25+ offices globally figure should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.foundedYearStat,
        '"Founded in 2005" should be visible',
      ).toBeVisible();

      await expect(
        companyPage.dailyVolumesStat,
        '$35B daily perpetuals volume should be visible',
      ).toBeVisible();
    });

    test('company page strength pillars are all visible', { tag: '@sanity' }, async ({ companyPage }) => {
      await companyPage.goto();

      await expect.soft(
        companyPage.regulationAtCorePillar,
        '"Regulation at our core" pillar should be visible',
      ).toBeVisible();

      await expect.soft(
        companyPage.provenTrackRecordPillar,
        '"Proven Track Record" pillar should be visible',
      ).toBeVisible();

      await expect(
        companyPage.secureTrustedPillar,
        '"Secure & Trusted" pillar should be visible',
      ).toBeVisible();
    });

  });

});
