import { test, expect } from '../fixtures/pages.fixture';
import { DESKTOP_VIEWPORTS } from '../testdata/viewports';

test.describe('Navigation & Layout', () => {

  // ── NAV-01 ──────────────────────────────────────────────────────────────────

  test.describe('NAV-01 — Top navigation renders all expected items', () => {

    test('all eight nav links are visible on the home page', { tag: ['@smoke', '@sanity'] }, async ({ page, navigationBar }) => {
      await page.goto('/en');

      // Soft-assert each item so a single missing link doesn't mask the rest.
      // Sign in/Sign up sit outside the <nav> landmark, which is why they use separate getters.
      await expect.soft(navigationBar.exploreLink,  '"Explore" should be visible in the nav').toBeVisible();
      await expect.soft(navigationBar.featuresLink, '"Features" should be visible in the nav').toBeVisible();
      await expect.soft(navigationBar.otcDeskLink,  '"OTC Desk" should be visible in the nav').toBeVisible();
      await expect.soft(navigationBar.companyLink,  '"Company" should be visible in the nav').toBeVisible();
      await expect.soft(navigationBar.supportLink,  '"Support" should be visible in the nav').toBeVisible();
      await expect.soft(navigationBar.mbgLink,      '"$MBG" should be visible in the nav').toBeVisible();
      await expect.soft(navigationBar.signInLink,   '"Sign in" should be visible in the header').toBeVisible();
      await expect(navigationBar.signUpLink,        '"Sign up" should be visible in the header').toBeVisible();
    });

  });

  // ── NAV-02 ──────────────────────────────────────────────────────────────────

  test.describe('NAV-02 — Navigation links lead to the correct destinations', () => {

    // URL patterns match the path segment only — the site appends a region suffix
    // (e.g. /en-AE/explore) after redirect, so we avoid asserting the full URL.
    const clickableItems = [
      { label: 'Explore',  urlPattern: /\/explore/      },
      { label: 'Features', urlPattern: /\/features/     },
      { label: 'OTC Desk', urlPattern: /\/otc-desk/ },
      { label: 'Company',  urlPattern: /\/company/      },
      { label: 'Support',  urlPattern: /\/support/      },
    ] as const;

    for (const { label, urlPattern } of clickableItems) {
      test(`"${label}" navigates to the expected URL`, { tag: '@sanity' }, async ({ page, navigationBar }) => {
        await page.goto('/en');
        await navigationBar.nav.getByRole('link', { name: label }).click();
        await expect(page).toHaveURL(urlPattern);
      });
    }

    test('"$MBG" link points to the MultiBank token site', { tag: '@sanity' }, async ({ page, navigationBar }) => {
      await page.goto('/en');
      // href presence only — HTTP 200 validation for the live external URL is in EDGE-04
      await expect(navigationBar.mbgLink).toHaveAttribute('href', /token\.multibankgroup\.com/);
    });

    test('"Sign in" and "Sign up" are present and point to the correct auth destinations', { tag: '@sanity' }, async ({ page, navigationBar }) => {
      await page.goto('/en');
      // Sign in is a link — verify it points to the login page
      await expect.soft(
        navigationBar.signInLink,
        '"Sign in" should point to the login page',
      ).toHaveAttribute('href', /\/login/);
      // Sign up is a button, not a link — no href to assert against
      await expect(
        navigationBar.signUpLink,
        '"Sign up" should be visible and accessible',
      ).toBeVisible();
    });

  });

  // ── NAV-03 ──────────────────────────────────────────────────────────────────

  test.describe('NAV-03 — Navigation and footer are stable across standard desktop viewport sizes', () => {

    // Cover the two most common desktop widths: standard laptop and full HD
    const desktopSizes = DESKTOP_VIEWPORTS.filter((v) => v.width === 1280 || v.width === 1920);

    for (const { name, width, height } of desktopSizes) {
      test(`nav bar and footer are fully visible at ${name} (${width}×${height})`, { tag: '@sanity' }, async ({ page, navigationBar, footer }) => {
        await page.setViewportSize({ width, height });
        await page.goto('/en');

        // All nav items should be visible at desktop — nothing should be collapsed
        await expect(navigationBar.nav, 'Navigation bar should be visible').toBeVisible();
        await expect.soft(navigationBar.exploreLink, '"Explore" should not be hidden at desktop').toBeVisible();
        await expect.soft(navigationBar.featuresLink, '"Features" should not be hidden at desktop').toBeVisible();
        await expect.soft(navigationBar.otcDeskLink, '"OTC Desk" should not be hidden at desktop').toBeVisible();
        await expect.soft(navigationBar.companyLink, '"Company" should not be hidden at desktop').toBeVisible();
        await expect.soft(navigationBar.supportLink, '"Support" should not be hidden at desktop').toBeVisible();
        await expect.soft(navigationBar.mbgLink, '"$MBG" should not be hidden at desktop').toBeVisible();
        await expect.soft(navigationBar.signInLink, '"Sign in" should not be hidden at desktop').toBeVisible();
        await expect.soft(navigationBar.signUpLink, '"Sign up" should not be hidden at desktop').toBeVisible();

        // Scroll to bottom to trigger lazy rendering before asserting the footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(footer.footer, 'Footer should be present on the page').toBeVisible();

        // Overflow at desktop width usually means a fixed-width element breaking the layout
        const hasOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(hasOverflow, `Page should not have horizontal overflow at ${name}`).toBe(false);
      });
    }

  });

});
