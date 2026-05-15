import { Page, Locator } from '@playwright/test';
import { BasePage } from './base/BasePage';

export class HomePage extends BasePage {
  // ── Hero section ─────────────────────────────────────────────────────────
  readonly heroHeading: Locator;
  readonly heroSubtext: Locator;

  // ── Primary CTAs ─────────────────────────────────────────────────────────
  readonly downloadAppCta: Locator;
  readonly openAccountCta: Locator;

  constructor(page: Page) {
    super(page);

    this.heroHeading = page.getByRole('heading', { name: /crypto for everyone/i });
    this.heroSubtext = page.getByText(/simple, secure and speedy/i);

    // "Download the app" renders as a link on some pages and a button on others
    this.downloadAppCta = page
      .getByRole('link', { name: /download the app/i })
      .or(page.getByRole('button', { name: /download the app/i }))
      .first();

    this.openAccountCta = page
      .getByRole('link', { name: /open an account/i })
      .or(page.getByRole('button', { name: /open an account/i }));
  }

  async goto(): Promise<void> {
    await super.goto('/en');
  }
}
