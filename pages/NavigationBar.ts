import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class NavigationBar extends BasePage {
  // NOTE: Recommend data-testid="nav-main" on the nav element
  readonly nav: Locator;
  readonly logoLink: Locator;

  // NOTE: Recommend data-testid="nav-link-trading" etc. once adopted
  readonly tradingLink: Locator;
  readonly marketsLink: Locator;
  readonly aboutLink: Locator;

  constructor(page: Page) {
    super(page);

    this.nav = page.getByRole('navigation').first();
    this.logoLink = page.getByRole('link', { name: /multibank|mb/i }).first();
    this.tradingLink = page.getByRole('link', { name: /trading/i });
    this.marketsLink = page.getByRole('link', { name: /markets/i });
    this.aboutLink = page.getByRole('link', { name: /about/i });
  }

  async isVisible(): Promise<boolean> {
    return this.nav.isVisible();
  }

  async navigateTo(link: Locator): Promise<void> {
    await link.click();
  }
}
