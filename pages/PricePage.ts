import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class PricePage extends BasePage {
  // ── Price display ─────────────────────────────────────────────────────────
  // Assert format only — the live value changes every tick
  readonly priceDisplay: Locator;

  // ── 24h change indicator ──────────────────────────────────────────────────
  readonly changeIndicator: Locator;

  // ── Chart section ─────────────────────────────────────────────────────────
  readonly chartSection: Locator;

  constructor(page: Page) {
    super(page);

    // The price renders as an h3 with only the numeric value (e.g. "79,239.10" or "0.26")
    // The $ symbol is a separate inline element alongside the h3.
    // Two matching h3s exist per page — the first is a hidden mobile layout variant.
    // nth(1) consistently targets the visible desktop element.
    this.priceDisplay = page
      .locator('h3')
      .filter({ hasText: /\d+[.,]\d+/ })
      .nth(1);

    // Class-based fallback — the change cell doesn't have a reliable semantic role
    this.changeIndicator = page
      .locator('[class*="change"],[class*="Change"]')
      .first();

    this.chartSection = page
      .locator('canvas, [class*="chart"], [class*="Chart"]')
      .first();
  }

  // Symbol must be uppercase — the route pattern is /en/explore/{SYMBOL}
  // networkidle ensures the client-side price data has rendered before assertions run
  async gotoAsset(symbol: string): Promise<void> {
    await this.page.goto(`/en/explore/${symbol.toUpperCase()}`, { waitUntil: 'networkidle' });
  }

  getAssetHeading(assetName: string): Locator {
    // The coin name appears as a text label alongside the ticker, e.g. "Bitcoin BTC"
    return this.page.getByText(new RegExp(assetName, 'i')).first();
  }
}
