import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class ExplorePage extends BasePage {
  // ── Page headings ─────────────────────────────────────────────────────────
  readonly pageHeading: Locator;
  readonly spotMarketSubheading: Locator;

  // ── Promotional banners ──────────────────────────────────────────────────
  readonly earnInterestBanner: Locator;
  readonly earnInterestBannerSubLabel: Locator;
  readonly cryptoWithCardBanner: Locator;
  readonly cryptoWithCardBannerSubLabel: Locator;
  readonly depositsBanner: Locator;
  readonly depositsBannerSubLabel: Locator;

  // ── Market sentiment widget ───────────────────────────────────────────────
  // Displays a live value — assert visibility and format only, not exact value
  readonly marketSentimentWidget: Locator;

  // ── Download app CTA ──────────────────────────────────────────────────────
  readonly downloadAppCta: Locator;

  // ── Spot market tabs ──────────────────────────────────────────────────────
  // .or() handles the case where tabs render as buttons rather than role="tab"
  readonly hotTab: Locator;
  readonly gainersTab: Locator;
  readonly losersTab: Locator;

  // ── Asset table ───────────────────────────────────────────────────────────
  // Primary: semantic <table>; fallback: if CSS grid is used
  readonly assetTable: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeading = page.getByRole('heading', { name: /markets at your fingertips/i });
    this.spotMarketSubheading = page.getByText(/explore\.\s*track\.\s*trade/i);

    this.earnInterestBanner = page.getByText(/earn interest on your assets/i);
    this.earnInterestBannerSubLabel = page.getByText(/up to 25%\s*apy/i);
    this.cryptoWithCardBanner = page.getByText(/get crypto with your card/i);
    this.cryptoWithCardBannerSubLabel = page.getByText(/instant buy/i);
    this.depositsBanner = page.getByText(/deposits using card or wire transfer/i);
    this.depositsBannerSubLabel = page.getByText(/top up today/i);

    // Matches any valid Fear & Greed label — value changes with live market data
    this.marketSentimentWidget = page
      .getByText(/extreme fear|extreme greed|fear|greed|neutral/i)
      .first();

    this.downloadAppCta = page
      .getByRole('link', { name: /download the app/i })
      .or(page.getByRole('button', { name: /download the app/i }));

    this.hotTab = page
      .getByRole('tab', { name: /^hot$/i })
      .or(page.getByRole('button', { name: /^hot$/i }));

    this.gainersTab = page
      .getByRole('tab', { name: /^gainers$/i })
      .or(page.getByRole('button', { name: /^gainers$/i }));

    this.losersTab = page
      .getByRole('tab', { name: /^losers$/i })
      .or(page.getByRole('button', { name: /^losers$/i }));

    this.assetTable = page.getByRole('table').first();
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await super.goto('/en/explore');
  }

  // ── Tab actions ───────────────────────────────────────────────────────────

  async clickHotTab(): Promise<void> {
    await this.hotTab.click();
  }

  async clickGainersTab(): Promise<void> {
    await this.gainersTab.click();
  }

  async clickLosersTab(): Promise<void> {
    await this.losersTab.click();
  }

  // ── Asset row helpers ─────────────────────────────────────────────────────

  // Data rows only — excludes the header row
  get assetRows(): Locator {
    return this.page
      .getByRole('row')
      .filter({ hasNot: this.page.getByRole('columnheader') });
  }

  // Returns the change percentage element for a given row (e.g. "+1.13%", "-1.82%")
  // Direction is shown via +/- sign in the text — there are no separate arrow icon elements
  getChangeIndicator(row: Locator): Locator {
    return row.getByText(/[+\-]?[\d.]+%/).first();
  }

  // Collects visible asset symbol strings from the current tab
  // Used in EDGE-02 to compare Gainers vs Losers for overlapping symbols
  async getVisibleAssetSymbols(): Promise<string[]> {
    const rows = this.assetRows;
    const count = await rows.count();
    const symbols: string[] = [];

    for (let i = 0; i < count; i++) {
      // Column 0 is the asset name+symbol cell (logo + ticker + full name)
      const cell = rows.nth(i).getByRole('cell').nth(0);
      const text = (await cell.textContent())?.trim();
      if (text) symbols.push(text.toUpperCase());
    }

    return symbols;
  }

  async waitForTableLoad(): Promise<void> {
    await this.assetTable.waitFor({ state: 'visible' });
  }
}
