import { test, expect } from '../fixtures/pages.fixture';
import { CRYPTO_ASSETS, PRICE_FORMAT_REGEX } from '../testdata/assets';

// ── BONUS-03 ──────────────────────────────────────────────────────────────────

test.describe('BONUS-03 — Parameterized: individual asset price pages load correctly', () => {

  for (const { symbol, displayName } of CRYPTO_ASSETS) {
    test(`${displayName} (/en/explore/${symbol.toUpperCase()}) loads with a heading and a valid price`, async ({ pricePage }) => {
      await pricePage.gotoAsset(symbol);

      await expect(
        pricePage.getAssetHeading(displayName),
        `"${displayName}" heading should be visible on the price page`,
      ).toBeVisible();

      await expect(
        pricePage.priceDisplay,
        `${displayName} price element should be visible`,
      ).toBeVisible();

      const priceText = (await pricePage.priceDisplay.textContent()) ?? '';
      expect(
        priceText.trim(),
        `${displayName} price should be a numeric value (e.g. 62,400.12), got: "${priceText.trim()}"`,
      ).toMatch(PRICE_FORMAT_REGEX);
    });
  }

});
