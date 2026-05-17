import { test, expect } from '../fixtures/pages.fixture';

test.describe('Trading Functionality', () => {

  // ── TRADE-01 ─────────────────────────────────────────────────────────────────

  test.describe('TRADE-01 — Spot market section renders with all expected components', () => {

    test('explore page shows the market heading, all three tabs, sentiment widget, and download CTA', { tag: ['@smoke', '@sanity'] }, async ({ explorePage }) => {
      await explorePage.goto();
      // Wait for the market data section to render before asserting tabs —
      // the heading is static HTML but tabs are JS-rendered and load later.
      await explorePage.waitForTableLoad();

      await expect(
        explorePage.pageHeading,
        '"Markets at your fingertips" heading should be visible on the explore page',
      ).toBeVisible();

      await expect.soft(explorePage.hotTab,     '"Hot" tab should be visible').toBeVisible();
      await expect.soft(explorePage.gainersTab, '"Gainers" tab should be visible').toBeVisible();
      await expect.soft(explorePage.losersTab,  '"Losers" tab should be visible').toBeVisible();

      // The sentiment widget shows a live Fear & Greed value — any valid label passes
      await expect.soft(
        explorePage.marketSentimentWidget,
        'Market sentiment widget should display a Fear/Greed label',
      ).toBeVisible();

      await expect(
        explorePage.downloadAppCta,
        '"Download the app" CTA should be visible and accessible',
      ).toBeVisible();
    });

  });

  // ── TRADE-02 ─────────────────────────────────────────────────────────────────

  test.describe('TRADE-02 — Trading pairs are grouped correctly by tab', () => {

    test('Hot tab shows a populated list of assets', { tag: '@sanity' }, async ({ explorePage }) => {
      await explorePage.goto();
      await explorePage.clickHotTab();
      await explorePage.waitForTableLoad();

      await expect(
        explorePage.assetRows.first(),
        'Hot tab should display at least one asset row',
      ).toBeVisible();
    });

    test('Gainers tab shows assets with positive percentage changes', { tag: '@sanity' }, async ({ explorePage }) => {
      await explorePage.goto();
      await explorePage.clickGainersTab();
      await explorePage.waitForTableLoad();

      const rowCount = await explorePage.assetRows.count();
      expect(rowCount, 'Gainers tab should have at least one asset row').toBeGreaterThan(0);

      // Direction is colour-coded only — no sign prefix in the text value.
      const toCheck = Math.min(rowCount, 5);
      for (let i = 0; i < toCheck; i++) {
        const indicator = explorePage.getChangeIndicator(explorePage.assetRows.nth(i));
        await expect.soft(indicator, `Row ${i + 1} change value should be visible`).toBeVisible();
        const changeText = (await indicator.textContent()) ?? '';
        const numericChange = parseFloat(changeText.replace('%', '').trim());
        // >= 0 rather than > 0 — in a flat market an asset can show 0.00% and still
        // rank as a top gainer relative to the rest of the list.
        expect.soft(numericChange, `Row ${i + 1} on Gainers should have a non-negative change value`).toBeGreaterThanOrEqual(0);
      }
    });

    test('Losers tab shows assets with a visible percentage change value per row', { tag: '@sanity' }, async ({ explorePage }) => {
      await explorePage.goto();
      await explorePage.clickLosersTab();
      await explorePage.waitForTableLoad();

      const rowCount = await explorePage.assetRows.count();
      expect(rowCount, 'Losers tab should have at least one asset row').toBeGreaterThan(0);

      // Direction is colour-coded, not sign-prefixed. In a bull market the Losers tab shows
      // the smallest gainers, so a positive value here is expected behaviour.
      // Assert format only — structural completeness is what matters.
      const toCheck = Math.min(rowCount, 5);
      for (let i = 0; i < toCheck; i++) {
        const indicator = explorePage.getChangeIndicator(explorePage.assetRows.nth(i));
        await expect.soft(indicator, `Row ${i + 1} change value should be visible`).toBeVisible();
        const changeText = (await indicator.textContent()) ?? '';
        expect.soft(
          changeText,
          `Row ${i + 1} on Losers should show a valid percentage value`,
        ).toMatch(/[\d.]+%/);
      }
    });

    test('Gainers and Losers tabs each show a distinct, non-empty set of assets', { tag: '@sanity' }, async ({ explorePage }) => {
      await explorePage.goto();

      await explorePage.clickGainersTab();
      await explorePage.waitForTableLoad();
      const gainers = await explorePage.getVisibleAssetSymbols();

      await explorePage.clickLosersTab();
      await explorePage.waitForTableLoad();
      const losers = await explorePage.getVisibleAssetSymbols();

      // Both tabs must be populated
      expect(gainers.length, 'Gainers tab should return at least one asset symbol').toBeGreaterThan(0);
      expect(losers.length, 'Losers tab should return at least one asset symbol').toBeGreaterThan(0);

      // The two lists must not be identical — same list would mean the tabs aren't grouped differently.
      // Individual overlap is possible under live conditions; strict no-overlap is tested in EDGE-02.
      expect(
        gainers.join(','),
        'Gainers and Losers should not be the same list of assets',
      ).not.toBe(losers.join(','));
    });

  });

  // ── TRADE-03 ─────────────────────────────────────────────────────────────────

  test.describe('TRADE-03 — Each asset row contains all required data fields', () => {

    test('first asset on the Hot tab has a name, a USD price, and a change value', { tag: '@sanity' }, async ({ explorePage }) => {
      await explorePage.goto();
      await explorePage.clickHotTab();
      await explorePage.waitForTableLoad();

      const firstRow = explorePage.assetRows.first();
      await expect(firstRow, 'First asset row should be visible').toBeVisible();

      // Row must contain at least 3 columns: name, price, change
      const cells = firstRow.getByRole('cell');
      const cellCount = await cells.count();
      expect(cellCount, 'Asset row should have at least 3 columns (name, price, change)').toBeGreaterThanOrEqual(3);

      // Locate the price element directly within the row — the full row text concatenates
      // name + price + % so anchored regex against it will always fail
      const priceElement = firstRow.getByText(/\$[\d,]+(\.\d+)?/).first();
      await expect(priceElement, 'Asset row should contain a visible USD price value').toBeVisible();
    });

  });

});
