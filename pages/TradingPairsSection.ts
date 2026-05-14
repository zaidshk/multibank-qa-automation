import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class TradingPairsSection extends BasePage {
  // NOTE: Recommend data-testid="section-trading-pairs" on the section wrapper
  readonly section: Locator;

  // NOTE: Recommend data-testid="card-trading-pair-{symbol}" on each card
  readonly pairCards: Locator;

  constructor(page: Page) {
    super(page);

    // Scope to the section containing trading pair data; refine once live DOM is inspected.
    this.section = page.locator('section').filter({ hasText: /forex|crypto|bitcoin|trading pairs/i }).first();
    this.pairCards = this.section.locator('[class*="pair"], [class*="card"], [class*="instrument"]');
  }

  async getPairCardBySymbol(symbol: string): Promise<Locator> {
    return this.section.getByText(symbol, { exact: false }).first();
  }

  async getPairCardCount(): Promise<number> {
    return this.pairCards.count();
  }
}
